package com.example.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    public static MainActivity instance;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        instance = this; // Masukkan diri sendiri ke variabel instance
        super.onCreate(savedInstanceState);
    }
}
