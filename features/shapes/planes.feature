Feature: Planes

  Scenario: The normal of a plane is constant everywhere
    Given p ← plane()
    When n1 ← local_normal_at(p, point(0, 0, 0))
    And n2 ← local_normal_at(p, point(10, 0, -10))
    And n3 ← local_normal_at(p, point(-5, 0, 150))
    Then n1 = vector(0, 1, 0)
    And n2 = vector(0, 1, 0)
    And n3 = vector(0, 1, 0)

  Scenario: Intersect with a ray parallel to the plane
    Given p ← plane()
    And r ← ray(point(0, 10, 0), vector(0, 0, 1))
    When xs ← local_intersect(p, r)
    Then xs is empty

  Scenario: Intersect with a coplanar ray
    Given p ← plane()
    And r ← ray(point(0, 0, 0), vector(0, 0, 1))
    When xs ← local_intersect(p, r)
    Then xs is empty

  Scenario: A ray intersecting a plane from above
    Given p ← plane()
    And r ← ray(point(0, 1, 0), vector(0, -1, 0))
    When xs ← local_intersect(p, r)
    Then xs.count = 1
    And xs[0].t = 1
    And xs[0].object = p

  Scenario: A ray intersecting a plane from below
    Given p ← plane()
    And r ← ray(point(0, -1, 0), vector(0, 1, 0))
    When xs ← local_intersect(p, r)
    Then xs.count = 1
    And xs[0].t = 1
    And xs[0].object = p

  Scenario: Comparing Planes
    Given a ← plane()
    Given b ← plane()
    Then a shape.equals b
    Then b shape.equals a

  Scenario: Comparing Planes not equal (translation)
    Given a ← plane()
    And b ← plane()
    And set_transform(b, translation(0, 0, -3))
    Then a does not shape.equals b
    Then b does not shape.equals a

  Scenario: Comparing Planes not equal (material)
    Given a ← plane()
    And b ← plane()
    And set_transform(b, translation(0, 0, -3))
    And m ← material()
    And m.pattern ← stripe_pattern(color(1, 1, 1), color(0, 0, 0))
    And set_material(b, m)
    Then a does not shape.equals b
    Then b does not shape.equals a

# Bug Fixes


