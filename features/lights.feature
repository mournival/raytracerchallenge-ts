#noinspection CucumberUndefinedStep
Feature: Lights

  Scenario: A point light has a position and intensity
    Given intensity ← color(1, 1, 1)
    And position ← point(0, 0, 0)
    When light ← point_light(position, intensity)
    Then light.position = position
    And light.intensity = intensity

  Scenario: Lights with different positions are different
    Given i1 ← color(1, 1, 1)
    And p1 ← point(0, 0, 0)
    And p2 ← point(1, 2, 3)
    When l1 ← point_light(p1, i1)
    When l2 ← point_light(p2, i1)
    Then l1 does not light.equals l2

  Scenario: Lights with different illumination are different
    Given i1 ← color(1, 1, 1)
    And p1 ← point(0, 0, 0)
    And i2 ← color(0.5, 0.5, 0.5)
    When l1 ← point_light(p1, i1)
    When l2 ← point_light(p1, i2)
    Then l1 does not light.equals l2