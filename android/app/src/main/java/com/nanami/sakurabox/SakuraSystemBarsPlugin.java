package com.nanami.sakurabox;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SakuraSystemBars")
public class SakuraSystemBarsPlugin extends Plugin {
    @PluginMethod
    public void setStyle(PluginCall call) {
        Boolean dark = call.getBoolean("dark");
        if (dark == null) {
            call.reject("The dark option is required");
            return;
        }

        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is unavailable");
            return;
        }

        activity.runOnUiThread(() -> {
            Window window = activity.getWindow();
            WindowCompat.setDecorFitsSystemWindows(window, false);
            window.setStatusBarColor(Color.TRANSPARENT);
            window.setNavigationBarColor(Color.TRANSPARENT);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setStatusBarContrastEnforced(false);
                window.setNavigationBarContrastEnforced(false);
            }

            WindowInsetsControllerCompat controller =
                new WindowInsetsControllerCompat(window, window.getDecorView());
            controller.setAppearanceLightStatusBars(!dark);
            controller.setAppearanceLightNavigationBars(!dark);
            call.resolve();
        });
    }
}
