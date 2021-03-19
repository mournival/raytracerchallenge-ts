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