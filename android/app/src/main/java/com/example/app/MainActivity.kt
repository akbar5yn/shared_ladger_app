package com.example.app

import android.app.NotificationManager
import android.content.*
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.MediaStore
import android.provider.Settings
import android.service.notification.NotificationListenerService
import android.util.Log
import androidx.activity.result.contract.ActivityResultContracts
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin

// 1. PLUGIN NOTIFICATION STORAGE
@CapacitorPlugin(name = "NotificationStorage")
class NotificationStoragePlugin : Plugin() {

    @PluginMethod
    fun getPendingNotifications(call: PluginCall) {
        val prefs = context.getSharedPreferences("BankNotifications", Context.MODE_PRIVATE)
        val data = prefs.getString("pending_list", "[]") ?: "[]"

        val ret = JSObject().apply {
            put("data", data)
            put("count", if (data == "[]" || data.isEmpty()) 0 else 1) // Simple count logic
        }

        if (data != "[]" && data.isNotEmpty()) {
            prefs.edit().remove("pending_list").apply()
        }
        
        call.resolve(ret)
    }

    @PluginMethod
    fun exportData(call: PluginCall) {
        val data = call.getString("dataExport") ?: ""
        if (data.isEmpty()) return call.reject("Datanya kosong, kaga ada yang bisa di-export!")

        (activity as? MainActivity)?.let {
            it.exportToDownloads(data)
            call.resolve()
        } ?: call.reject("MainActivity tidak ditemukan!")
    }

    @PluginMethod
    fun triggerImport(call: PluginCall) {
        (activity as? MainActivity)?.openFilePicker()
        call.resolve()
    }
}

// 2. MAIN ACTIVITY
class MainActivity : BridgeActivity() {

    private val tag = "APP_NOTIF"

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val title = (intent?.getStringExtra("title") ?: "").replace("\"", "\\\"")
            val text = (intent?.getStringExtra("text") ?: "").replace("\"", "\\\"")
            val pkg = intent?.getStringExtra("pkg") ?: ""

            // Mengirim data ke WebView via CustomEvent
            val jsCode = """
                window.dispatchEvent(new CustomEvent('onBankNotification', { 
                    detail: { title: "$title", text: "$text", pkg: "$pkg" } 
                }));
            """.trimIndent()
            
            bridge?.webView?.evaluateJavascript(jsCode, null)
        }
    }

    private val filePickerLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        uri?.let {
            try {
                val content = contentResolver.openInputStream(it)?.bufferedReader()?.use { it.readText() }
                content?.let { rawData ->
                    val escaped = rawData.replace("\\", "\\\\")
                        .replace("'", "\\'")
                        .replace("\n", "\\n")
                        .replace("\r", "")

                    val jsCode = "setTimeout(() => window.dispatchEvent(new CustomEvent('onImportData', { detail: { data: '$escaped' } })), 200)"
                    bridge?.webView?.evaluateJavascript(jsCode, null)
                }
            } catch (e: Exception) {
                Log.e(tag, "❌ Gagal baca file: ${e.message}")
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(NotificationStoragePlugin::class.java)
        super.onCreate(savedInstanceState)
        // val serviceIntent = Intent(this, AppNotificationListener::class.java)
        // try {
        //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        //         startForegroundService(serviceIntent)
        //     } else {
        //         startService(serviceIntent)
        //     }
        // } catch (e: Exception) {
        //     Log.e(tag, "Gagal pancing servis di onCreate: ${e.message}")
        // }
        checkBatteryOptimization()
        checkNotificationPermission()
    }

    private fun checkNotificationPermission() {
        val enabled = Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        if (enabled == null || !enabled.contains(packageName)) {
            Log.d(tag, "⚠️ Izin belum aktif, ke Settings...")
            startActivity(Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"))
        }
    }

    private fun checkBatteryOptimization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = Uri.parse("package:$packageName")
                })
            }
        }
    }

    private fun isNotificationRunning(): Boolean {
        val enabledListeners = Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        val myComponentName = ComponentName(this, AppNotificationListener::class.java).flattenToString()
        return enabledListeners != null && enabledListeners.contains(myComponentName)
    }

    override fun onResume() {
        super.onResume()
        val component = ComponentName(this, AppNotificationListener::class.java)
        // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        //     NotificationListenerService.requestRebind(component)
        //     Log.d(tag, "🔄 Meminta Re-bind Servis...")
        // }
        val isRunning = isNotificationRunning()
        if(!isRunning){
            Log.d(tag, "⚠️ Servis mati, mencoba menghidupkan kembali...")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                NotificationListenerService.requestRebind(component)
                Log.d(tag, "🔄 Meminta Re-bind Servis...aa")
            }
            val intent = Intent(this, AppNotificationListener::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent)
            } else {
                startService(intent)
            }
        } else {
            Log.d(tag, "✅ Servis sudah berjalan, tidak perlu rebind. $isRunning")
        }
    }

    override fun onStart() {
        super.onStart()
        val filter = IntentFilter("com.example.app.NOTIFICATION_RECEIVED")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(receiver, filter)
        }
    }

    override fun onStop() {
        super.onStop()
        try { unregisterReceiver(receiver) } catch (e: Exception) { }
    }

    fun openFilePicker() = filePickerLauncher.launch("application/json")

    fun exportToDownloads(data: String) {
        val isJson = data.trim().startsWith("{") || data.trim().startsWith("[")
        val ext = if (isJson) "json" else "csv"
        val mime = if (isJson) "application/json" else "text/csv"
        val fileName = "${if (isJson) "BACKUP" else "LAPORAN"}_Ledger_${System.currentTimeMillis()}.$ext"

        val values = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(MediaStore.MediaColumns.MIME_TYPE, mime)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                put(MediaStore.MediaColumns.RELATIVE_PATH, "Download/SharedLedger")
            }
        }

        contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)?.let { uri ->
            contentResolver.openOutputStream(uri)?.use { it.write(data.toByteArray()) }
            Log.d(tag, "✅ File Berhasil: $fileName")
        }
    }
}