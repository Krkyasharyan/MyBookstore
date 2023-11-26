package com.example.api.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.web.context.WebApplicationContext;


@Service
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SessionTimerServiceImpl implements SessionTimerService{
    
    private long startTime;

    @Override
    public void startTimer() {
        // TODO Auto-generated method stub
        this.startTime = System.currentTimeMillis();
        
    }

    @Override
    public long stopTimer() {
        // TODO Auto-generated method stub

        return (System.currentTimeMillis() - this.startTime)/1000;
    }

}
