package com.homeproject.db.repository;

public interface ConfigRepository {
    String getValue(String name);
    void setValue(String name, String value);
}
