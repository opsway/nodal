Feature: Market Settlements

  Background:
    Given Order with items:
      | SELLER | SKU   | PRICE | SHIPPING | QTY | STATUS  |
      | TA     | SKU_1 | 100   | 20       | 1   | ordered |

  Scenario: Flow A
    When happen "pay" via "paytm"
    Then balance accounts:
      | GATEWAY | SELLER | BANK | SHIPPING | MF FEE | GW FEE | MARKET |
      | 120     | 0      | 0    | 0        | 0      | 0      | 0      |
    When happen "invoice"
    Then balance accounts:
      | GATEWAY | SELLER | BANK | SHIPPING | MF FEE | GW FEE | MARKET |
      | 120     | 91.74  | 0    | 20.00    | 8.26   | 0      | 0      |
    When happen "gatewaySettlement" with "paytm"
    Then balance accounts:
      | GATEWAY | SELLER | BANK   | SHIPPING | MF FEE | GW FEE | MARKET |
      | 0       | 91.74  | 117.48 | 20.00    | 8.26   | 2.52   | 0      |
    When happen "sellerSettlement" with "TA"
    Then balance accounts:
      | GATEWAY | SELLER | BANK  | SHIPPING | MF FEE | GW FEE | MARKET |
      | 0       | 0      | 25.74 | 20.00    | 8.26   | 2.52   | 0      |
    When happen "marketSettlement"
    Then balance accounts:
      | GATEWAY | SELLER | BANK | SHIPPING | MF FEE | GW FEE | MARKET |
      | 0       | 0      | 0    | 0        | 0      | 0      | 25.74  |
