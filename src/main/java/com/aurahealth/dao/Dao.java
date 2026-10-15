package com.aurahealth.dao;

import java.util.List;
import java.util.Optional;

/**
 * Generic Data Access Object (DAO) Interface.
 * <p>
 * Defines standard CRUD (Create, Read, Update, Delete) persistence contracts
 * for domain model entities, adhering to the Data Access Object design pattern
 * and promoting decoupling between business services and database persistence.
 * </p>
 *
 * @param <T> The domain entity type managed by this DAO
 */
public interface Dao<T> {

    /**
     * Retrieves all records of entity type {@code T} from the persistent store.
     *
     * @return an unmodifiable or mutable list containing all entities found; empty list if none exist.
     */
    List<T> findAll();

    /**
     * Finds an entity by its unique primary key identifier.
     *
     * @param id the unique primary key of the entity
     * @return an {@link Optional} containing the entity if found, or {@link Optional#empty()} otherwise
     */
    Optional<T> findById(int id);

    /**
     * Deletes an entity record by its unique primary key identifier.
     *
     * @param id the unique primary key of the entity to delete
     * @return {@code true} if a record was deleted, {@code false} if no matching record existed
     */
    boolean delete(int id);
}

