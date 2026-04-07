package com.homeproject.db.config;

public interface ConfigRepository {
    String getValue(String name);
    void setValue(String name, String value);
}
