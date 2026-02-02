package com.example.app

import android.os.Bundle
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {

    // Singleton instance supaya Service bisa akses
    companion object {
        var instance: MainActivity? = null
    }

    // Receiver untuk dengerin broadcast dari Service (Kurir)
    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val title = intent?.getStringExtra("title") ?: ""
            val text = intent?.getStringExtra("text") ?: ""
            val pkg = intent?.getStringExtra("pkg") ?: ""

            // Kirim data ke WebView (Nuxt)
            val jsCode = """
                (function() {
                    var ev = new Event('onBankNotification');
                    ev.data = { title: "$title", text: "$text", pkg: "$pkg" };
                    window.dispatchEvent(ev);
                })();
            """.trimIndent()
            
            bridge?.webView?.evaluateJavascript(jsCode, null)
            Log.d("APP_NOTIF", "🖥️ WebView updated via Broadcast")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        instance = this
    }

    override fun onStart() {
        super.onStart()
        // Daftarkan listener broadcast
        val filter = IntentFilter("com.example.app.NOTIFICATION_RECEIVED")
        // Untuk Android 13+ (Tiramisu), perlu flag RECEIVER_EXPORTED atau NOT_EXPORTED
        registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
    }

    override fun onStop() {
        super.onStop()
        // Unregister biar gak memory leak
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