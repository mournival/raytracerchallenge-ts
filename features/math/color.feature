Feature: Color

  Scenario Outline: Mapping a Color of n = 0 to Byte
    Given color value of n ← <value>
    Then mapColor(n) = <mappedColor>
    Examples:
      | value | mappedColor |
      | 0     | 0           |
      | -0.01 | 0           |
      | -128  | 0           |
      | 1     | 255         |
      | 1.01  | 255         |
      | 256   | 255         |
      | 0.5   | 128         |

  Scenario Outline: Colors Differ
    Given a ← <A>
    And b ← <B>
    Then color a does not equal color b
    Then color b does not equal color a
    Examples:
      | A                   | B                  |
      | color(246, 103, 51) | color(0, 103, 51)  |
      | color(246, 103, 51) | color(246, 0, 51)  |
      | color(246, 103, 51) | color(246, 103, 0) |

  Scenario Outline: Color Multiply
    Given a ← <A>
    And b ← <B>
    When color c ← a * b
    Then color c = <C>
    Examples:
      | A                   | B              | C                   |
      | color(246, 103, 51) | color(0, 0, 0) | color(0, 0, 0)      |
      | color(246, 103, 51) | color(1, 1, 1) | color(246, 103, 51) |
#      | color(246, 103, 51) | color(200, 200, 200) | color(255, 255, 255) |

  Scenario Outline: Color asString
    Given a ← <color>
    Then color a as string is <stringValue>

    Examples:
      | color               | stringValue |
      | color(246, 103, 51) | 246 103 51  |