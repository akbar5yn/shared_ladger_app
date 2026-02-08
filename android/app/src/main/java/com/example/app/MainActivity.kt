package com.example.app

import android.os.Bundle
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.JSObject
import android.content.ComponentName 
import android.app.NotificationManager
import android.service.notification.NotificationListenerService
import android.provider.Settings
import android.os.PowerManager
import android.net.Uri
import androidx.activity.result.contract.ActivityResultContracts

// 1. DEFINISIKAN PLUGIN DI SINI
@CapacitorPlugin(name = "NotificationStorage")
class NotificationStoragePlugin : Plugin() {
    @PluginMethod
    fun getPendingNotifications(call: PluginCall) {
        val sharedPref = context.getSharedPreferences("BankNotifications", Context.MODE_PRIVATE)
        val data = sharedPref.getString("pending_list", "[]") ?: "[]"

        if (data == "[]" || data.isEmpty()) {
            val ret = JSObject()
            ret.put("data", "[]")
            ret.put("count", 0)
            return call.resolve(ret)
        }
        
        val ret = JSObject()
        ret.put("data", data)

        sharedPref.edit().remove("pending_list").apply()
        
        call.resolve(ret)
    }
    @PluginMethod
    fun exportData(call: PluginCall) {
        val dataDariNuxt = call.getString("dataExport") ?: ""
    
        if (dataDariNuxt.isEmpty()) {
            call.reject("Datanya kosong, kaga ada yang bisa di-export!")
            return
        }

        val mainActivity = activity as? MainActivity
        if (mainActivity != null) {
            mainActivity.exportToDownloads(dataDariNuxt)
            call.resolve()
        } else {
            call.reject("MainActivity tidak ditemukan!")
        }
    }

    @PluginMethod
    fun triggerImport(call: PluginCall) {
        val mainActivity = activity as? MainActivity
        mainActivity?.openFilePicker()
        call.resolve()
    }
}

class MainActivity : BridgeActivity() {

    companion object {
        var instance: MainActivity? = null
    }

    private fun isNotificationServiceRunning(): Boolean {
        val contentResolver = contentResolver
        val enabledNotificationListeners = Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        val packageName = packageName
        return enabledNotificationListeners != null && enabledNotificationListeners.contains(packageName)
    }

    override fun onResume() {
        super.onResume()
        try {
            val componentName = ComponentName(this, AppNotificationListener::class.java)
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                NotificationListenerService.requestRebind(componentName)
                Log.d("APP_NOTIF", "🔄 Meminta Re-bind Servis (onResume)...")
            }
        } catch (e: Exception) {
            Log.e("APP_NOTIF", "❌ Gagal rebind: ${e.message}")
        }
    }

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val title = intent?.getStringExtra("title") ?: ""
            val text = intent?.getStringExtra("text") ?: ""
            val pkg = intent?.getStringExtra("pkg") ?: ""

            // 2. GUNAKAN CustomEvent detail BIAR LEBIH STANDAR JS
            val jsCode = """
                (function() {
                    console.log('Native: Mengirim data ke WebView...');
                    var ev = new CustomEvent('onBankNotification', { 
                        detail: { title: "$title", text: "$text", pkg: "$pkg" } 
                    });
                    window.dispatchEvent(ev);
                })();
            """.trimIndent()
            
            bridge?.webView?.evaluateJavascript(jsCode, null)
        }
    }

    private fun checkBatteryOptimization() {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        val packageName = packageName
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                Log.d("APP_NOTIF", "⚠️ Baterai dibatasi, minta izin White-list...")
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
                intent.data = Uri.parse("package:$packageName")
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                startActivity(intent)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // REGISTER HARUS SEBELUM SUPER ONCREATE
        registerPlugin(NotificationStoragePlugin::class.java)
        super.onCreate(savedInstanceState)
        instance = this

        checkBatteryOptimization()

        if (!isNotificationServiceRunning()) {
            Log.d("APP_NOTIF", "⚠️ Izin belum aktif, melempar user ke Settings")
            val intent = Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
        } else {
            Log.d("APP_NOTIF", "✅ Izin aman, servis siap tempur")
        }
    }

    override fun onStart() {
        super.onStart()
        val filter = IntentFilter("com.example.app.NOTIFICATION_RECEIVED")
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(receiver, filter)
        }
    }

    override fun onStop() {
        super.onStop()
        try {
            unregisterReceiver(receiver)
        } catch (e: Exception) {
            Log.e("APP_NOTIF", "Error unregistering receiver: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (instance == this) {
            instance = null
        }
    }

    private val filePickerLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: android.net.Uri? ->
        uri?.let {
            try {
                val content = contentResolver.openInputStream(it)?.bufferedReader()?.use { it.readText() }
                if (content != null) {
                    // ESCAPING YANG LEBIH AMAN
                    val escapedContent = content
                        .replace("\\", "\\\\")
                        .replace("'", "\\'")
                        .replace("\n", "\\n")
                        .replace("\r", "")

                    // KASIH DELAY DIKIT BIAR WEBVIEW SIAP
                    val jsCode = """
                        setTimeout(function() {
                            console.log('Native: Mengirim data import...');
                            window.dispatchEvent(new CustomEvent('onImportData', { 
                                detail: { data: '$escapedContent' } 
                            }));
                        }, 200);
                    """.trimIndent()
                    
                    bridge?.webView?.evaluateJavascript(jsCode, null)
                }
            } catch (e: Exception) {
                Log.e("APP_NOTIF", "❌ Gagal baca file: ${e.message}")
            }
        }
    }

    fun openFilePicker() {
        filePickerLauncher.launch("application/json") // Cuma bolehin JSON buat import
    }

    fun exportToDownloads(data: String) {
        val isJson = data.trim().startsWith("{") || data.trim().startsWith("[")
        val ext = if (isJson) "json" else "csv"
        val mime = if (isJson) "application/json" else "text/csv"
        val prefix = if (isJson) "BACKUP" else "LAPORAN"

        val fileName = "${prefix}_Ledger_${System.currentTimeMillis()}.$ext"

        val contentValues = android.content.ContentValues().apply {
            put(android.provider.MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(android.provider.MediaStore.MediaColumns.MIME_TYPE, mime)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                put(android.provider.MediaStore.MediaColumns.RELATIVE_PATH, "Download/SharedLedger")
            }
        }

        val uri = contentResolver.insert(android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
        uri?.let {
            contentResolver.openOutputStream(it)?.use { stream ->
                stream.write(data.toByteArray())
            }
            Log.d("APP_NOTIF", "✅ File Berhasil: $fileName")
        }
    }
}