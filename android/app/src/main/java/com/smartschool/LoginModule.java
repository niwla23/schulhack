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
    public void get_remember_token(String url, String user, String password, Promise promise) {
        System.out.println("j1");
        try {
            System.out.println("j2");
            OkHttpClient client = new OkHttpClient.Builder()
                    .followRedirects(false)
                    .build();
            System.out.println("j3");
            RequestBody body = new FormBody.Builder()
                    .add("_username", user)
                    .add("_password", password)
                    .add("_remember_me", "on")
                    .build();
            System.out.println("j4");
            Request request = new Request.Builder()
                    .url("https://" + url + "/iserv/app/login")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("User-Agent", "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8")
                    .post(body)
                    .build();
            System.out.println("j5");
            Response response = client.newCall(request).execute();
            System.out.println("j6");
            String compiled = "";
            for (String cookie : response.headers("set-cookie")) {
                String key = cookie.split(";")[0].split("=")[0];
                String value = cookie.split(";")[0].split("=")[1];
                System.out.println("j7");
                System.out.println(key);
                if (key.equals("REMEMBERME")) {
                    System.out.println("got em");
                    compiled = value;
                }
            }
            System.out.println("resolving promise...");
            promise.resolve(compiled);
            System.out.println("promise resolved");
        } catch (Exception e) {
            promise.reject("Login failed" + e.getMessage(), e);
        }
    }

}
