# Composition Authority

This document defines ownership of cross-capability composition rules.

## Purpose

The Composition Authority exists to prevent architectural drift where logic
emerges "between" capabilities without clear ownership.

## Responsibilities

- Define cross-capability invariants
- Define authority precedence rules
- Define forbidden compositions
- Define allowable interaction patterns

## Non-Responsibilities

- Does NOT implement business logic
- Does NOT mutate state
- Does NOT authenticate users

## Phase Relationship

Phase 2 exists to verify Composition Authority rules procedurally.
Composition Authority is conceptual until promoted to a capability.

## Governance Rule

No capability may encode cross-capability policy decisions internally.
