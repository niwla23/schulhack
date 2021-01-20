package com.schulhack;


import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class LoginModule extends ReactContextBaseJavaModule {
    LoginModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "LoginModule";
    }

    @ReactMethod
    public void login(String url, String user, String password, Promise promise) {
        try {
            OkHttpClient client = new OkHttpClient.Builder()
                    .followRedirects(false)
                    .build();
            RequestBody body = new FormBody.Builder()
                    .add("_username", user)
                    .add("_password", password)
                    .build();
            Request request = new Request.Builder()
                    .url(url + "/iserv/app/login")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8")
                    .post(body)
                    .build();

            Response response = client.newCall(request).execute();
            StringBuilder compiled = new StringBuilder();
            for (String cookie : response.headers("set-cookie")) {
                compiled.append(cookie.split(";")[0]).append("; ");
            }
            compiled.setLength(compiled.length() - 2);
            promise.resolve(compiled.toString());

        } catch (Exception e) {
            promise.reject("Login failed" + e.getMessage(), e);
        }
    }
}
