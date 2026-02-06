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
}

class MainActivity : BridgeActivity() {

    companion object {
        var instance: MainActivity? = null
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

    override fun onCreate(savedInstanceState: Bundle?) {
        // REGISTER HARUS SEBELUM SUPER ONCREATE
        registerPlugin(NotificationStoragePlugin::class.java)
        super.onCreate(savedInstanceState)
        instance = this
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
}