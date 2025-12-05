package com.ruby.pro203_exam.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.boot.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/* Db Config for Check-Kid application - Configures the TWO separate DB's
    1. Auth Db - user credentials and authentication
    2. App Db - business data parent, staff, child, health data
*/

@Configuration
@EnableTransactionManagement
public class DatabaseConfig {

    // ----------------------------------------- AUTH DATABASE CONFIG (primary) ----------------------------------------- //

    // Create properties for auth db connection - reads from spring.datasource.auth in application.yaml
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.auth") // Bind to yaml properties
    public DataSourceProperties authDataSourceProperties() {
        return new DataSourceProperties ();
    }

    // Create an actual db connection for auth db - uses properties from authDataSourceProperties()
    @Bean
    @Primary
    public DataSource authDataSource() {
        return authDataSourceProperties()
                .initializeDataSourceBuilder()
                .build();
    }

    // Configure JPA/hibernate for auth db
    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean authEntityManagerFactory(EntityManagerFactoryBuilder builder,
                                                                           @Qualifier("authDataSource") DataSource authDataSource) {
        return builder
                .dataSource(authDataSource)
                .packages("com.ruby.pro203_exam.auth.model")
                .persistenceUnit("auth")
                .build();
    }

    // Transaction manager for auth db that handles @Transactional annotations for auth entities
    @Bean
    @Primary
    public PlatformTransactionManager authTransactionManager(@Qualifier("authEntityManagerFactory") EntityManagerFactory authEntityManagerFactory) {
        return new JpaTransactionManager(authEntityManagerFactory);
    }

    // Configure Spring Data JPA repository for auth db - tells spring where to find repo interfaces
    @Configuration
    @EnableJpaRepositories(
            basePackages = "com.ruby.pro203_exam.auth.repository",
            entityManagerFactoryRef = "authEntityManagerFactory",
            transactionManagerRef = "authTransactionManager"

    )
    static class AuthRepositoryConfig {
        // Config for auth repositories - will define later
    }

    // ----------------------------------------- APP DATABASE CONFIG (secondary) ----------------------------------------- //

    // Create properties for app database connection - reads from spring.datasource.app in application.yaml
    @Bean
    @ConfigurationProperties("spring.datasource.app")
    public DataSourceProperties appDataSourceProperties() {
        return new DataSourceProperties ();
    }

    // Create the actual db connection for app database - contains parents, staff, child, health tables
    @Bean
    public DataSource appDataSource() {
        return appDataSourceProperties()
                .initializeDataSourceBuilder()
                .build();
    }

    // Configure JPA/Hibernate for app db - scans multiple packages for entities
    @Bean
    public LocalContainerEntityManagerFactoryBean appEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("appDataSource") DataSource appDataSource) {
        return builder
                .dataSource(appDataSource)
                // Scan these packages for @Entity classes
                .packages(
                        "com.ruby.pro203_exam.parent.model",
                        "com.ruby.pro203_exam.staff.model",
                        "com.ruby.pro203_exam.child.model",
                        "com.ruby.pro203_exam.health.model",
                        "com.ruby.pro203_exam.checkinout.model"
                )
                .persistenceUnit("app")
                .build();
    }

    // Transactions manager for app db
    @Bean
    public PlatformTransactionManager appTransactionManager(
            @Qualifier("appEntityManagerFactory") EntityManagerFactory appEntityManagerFactory) {
        return new JpaTransactionManager(appEntityManagerFactory);
    }

    // Configures Spring Data JPA repo for app db - scans all the business doman repo packages
    @Configuration
    @EnableJpaRepositories(
            basePackages = {
                    "com.ruby.pro203_exam.parent.repository",
                    "com.ruby.pro203_exam.staff.repository",
                    "com.ruby.pro203_exam.child.repository",
                    "com.ruby.pro203_exam.health.repository",
                    "com.ruby.pro203_exam.checkinout.repository"
            },
            entityManagerFactoryRef = "appEntityManagerFactory",
            transactionManagerRef = "appTranscactionManager"
    )
    static class AppRepositoryConfig {
        // Config for app repo
    }
}
