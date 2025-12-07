package com.ruby.pro203_exam.config;

import jakarta.persistence.EntityManagerFactory;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;

/* Db Config for Check-Kid application - Configures the TWO separate DB's
    1. Auth Db - user credentials and authentication
    2. App Db - business data parent, staff, child, health data
*/

@Configuration
@EnableTransactionManagement
public class DatabaseConfig {

    // ----------------------------------------- AUTH DATABASE CONFIG (primary) ----------------------------------------- //

    // Create an actual db connection for auth db - reads from spring.datasource.auth in application.yaml
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource.auth")
    public DataSource authDataSource() {
        return DataSourceBuilder.create().build();
    }

    // Flyway configuration for auth database
    @Bean(initMethod = "migrate")
    @Primary
    public Flyway authFlyway(@Qualifier("authDataSource") DataSource authDataSource) {
        return Flyway.configure()
                .dataSource(authDataSource)
                .locations("classpath:db/migration/auth")
                .baselineOnMigrate(true)
                .load();
    }

    // Configure JPA/hibernate for auth db
    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean authEntityManagerFactory(
            @Qualifier("authDataSource") DataSource authDataSource,
            @Qualifier("authFlyway") Flyway authFlyway) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(authDataSource);
        em.setPackagesToScan("com.ruby.pro203_exam.auth.model");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setPersistenceUnitName("auth");

        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.put("hibernate.hbm2ddl.auto", "validate");
        em.setJpaPropertyMap(properties);

        return em;
    }

    // Transaction manager for auth db that handles @Transactional annotations for auth entities
    @Bean
    @Primary
    public PlatformTransactionManager authTransactionManager(
            @Qualifier("authEntityManagerFactory") EntityManagerFactory authEntityManagerFactory) {
        return new JpaTransactionManager(authEntityManagerFactory);
    }

    // Configure Spring Data JPA repository for auth db - tells spring where to find repo interfaces
    @Configuration
    @EnableJpaRepositories(
            basePackages = "com.ruby.pro203_exam.auth.repository",
            entityManagerFactoryRef = "authEntityManagerFactory",
            transactionManagerRef = "authTransactionManager"
    )
    static class AuthRepositoryConfig {}

    // ----------------------------------------- APP DATABASE CONFIG (secondary) ----------------------------------------- //

    // Create the actual db connection for app database - contains parents, staff, child, health tables
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.app")
    public DataSource appDataSource() {
        return DataSourceBuilder.create().build();
    }

    // Flyway configuration for app database
    @Bean(initMethod = "migrate")
    public Flyway appFlyway(@Qualifier("appDataSource") DataSource appDataSource) {
        return Flyway.configure()
                .dataSource(appDataSource)
                .locations("classpath:db/migration/app")
                .baselineOnMigrate(true)
                .load();
    }

    // Configure JPA/Hibernate for app db - scans multiple packages for entities
    @Bean
    public LocalContainerEntityManagerFactoryBean appEntityManagerFactory(
            @Qualifier("appDataSource") DataSource appDataSource,
            @Qualifier("appFlyway") Flyway appFlyway) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(appDataSource);
        em.setPackagesToScan(
                "com.ruby.pro203_exam.parent.model",
                "com.ruby.pro203_exam.staff.model",
                "com.ruby.pro203_exam.child.model",
                "com.ruby.pro203_exam.health.model",
                "com.ruby.pro203_exam.checkinout.model",
                "com.ruby.pro203_exam.kindergarten.model"
        );
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setPersistenceUnitName("app");

        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.put("hibernate.hbm2ddl.auto", "validate");
        em.setJpaPropertyMap(properties);

        return em;
    }

    // Transactions manager for app db
    @Bean
    public PlatformTransactionManager appTransactionManager(
            @Qualifier("appEntityManagerFactory") EntityManagerFactory appEntityManagerFactory) {
        return new JpaTransactionManager(appEntityManagerFactory);
    }

    // Configures Spring Data JPA repo for app db - scans all the business domain repo packages
    @Configuration
    @EnableJpaRepositories(
            basePackages = {
                    "com.ruby.pro203_exam.parent.repository",
                    "com.ruby.pro203_exam.staff.repository",
                    "com.ruby.pro203_exam.child.repository",
                    "com.ruby.pro203_exam.health.repository",
                    "com.ruby.pro203_exam.checkinout.repository",
                    "com.ruby.pro203_exam.kindergarten.repository"
            },
            entityManagerFactoryRef = "appEntityManagerFactory",
            transactionManagerRef = "appTransactionManager"
    )
    static class AppRepositoryConfig {}
}