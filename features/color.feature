Feature: Color

  Scenario: Mapping a Color of 0 to Byte
    Given color value of n ← 0
    Then mapColor(n) = 0

  Scenario: Mapping a Color of less 0 to Byte
    Given color value of n ← -0.01
    Then mapColor(n) = 0

  Scenario: Mapping a Color of 1 to Byte
    Given color value of n ← 1
    Then mapColor(n) = 255

  Scenario: Mapping a Color of Greater than 1 to Byte
    Given color value of n ← 1.01
    Then mapColor(n) = 255

  Scenario: Mapping a Color of Greater in (0,1) to Byte
    Given color value of n ← .5
    Then mapColor(n) = 128

  Scenario: Color Not Equals RGB
    Given a ← color(246, 103, 51)
    And b ← color(0, 0, 0)
    Then color a does not equal color b

  Scenario: Color Not Equals GB
    Given a ← color(246, 103, 51)
    And b ← color(246, 0, 0)
    Then color a does not equal color b

  Scenario: Color Not Equals B
    Given a ← color(246, 103, 51)
    And b ← color(246, 103, 0)
    Then color a does not equal color b

  Scenario: Color Not Equals G
    Given a ← color(246, 103, 51)
    And b ← color(246, 0, 51)
    Then color a does not equal color b

  Scenario: Color Not Equals R
    Given a ← color(246, 103, 51)
    And b ← color(0, 103, 51)
    Then color a does not equal color b

  Scenario: Color Multiply 0
    Given a ← color(246, 103, 51)
    And b ← color(0, 0, 0)
    When color c = a * b
    Then color c = color(0, 0, 0)

  Scenario: Color Multiply 1
    Given a ← color(246, 103, 51)
    And b ← color(1, 1, 1)
    When color c = a * b
    Then color c = color(246, 103, 51)

  Scenario: Color asString
    Given a ← color(246, 103, 51)
    Then color a as string is '246 103 51'