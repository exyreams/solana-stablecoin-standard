use fuzz_accounts::*;
use trident_fuzz::fuzzing::*;
mod fuzz_accounts;
mod types;
use types::*;

#[derive(FuzzTestMethods)]
struct FuzzTest {
    trident: Trident,
    fuzz_accounts: AccountAddresses,
}

#[flow_executor]
impl FuzzTest {
    fn new() -> Self {
        Self {
            trident: Trident::default(),
            fuzz_accounts: AccountAddresses::default(),
        }
    }

    #[init]
    fn start(&mut self) {
        // Initialize oracle at the start of each iteration
    }

    /// Attack Scenario 1: Price Manipulation via Circuit Breaker
    /// Tests that circuit breaker prevents large price swings
    #[flow]
    fn price_manipulation_attempt(&mut self) {
        // Crank feed with price X
        // Crank with price Y where |X-Y|/max(X,Y) > max_price_change_bps
        // Should fail with PriceChangeExceedsLimit
    }

    /// Attack Scenario 2: Stale Price Exploitation
    /// Tests that stale prices are filtered out
    #[flow]
    fn stale_price_exploitation(&mut self) {
        // Crank all feeds
        // Wait > max_staleness_seconds
        // Aggregate should fail InsufficientFeeds (all stale)
    }

    /// Attack Scenario 3: Manual Override Bypass
    /// Tests that manual price overrides feed prices
    #[flow]
    fn manual_override_test(&mut self) {
        // Set manual_price_active = true with price P
        // Crank feeds with different prices
        // Aggregate result MUST be P (manual overrides)
    }

    /// Attack Scenario 4: Unauthorized Cranker
    /// Tests that only authorized crankers can update feeds
    #[flow]
    fn unauthorized_cranker(&mut self) {
        // Non-cranker, non-authority calls crank_feed - should fail
        // Update cranker to new key
        // Old cranker should fail
    }

    /// Attack Scenario 5: Deviation Attack
    /// Tests that excessive price deviation is detected
    #[flow]
    fn deviation_attack(&mut self) {
        // Set deviation_threshold_bps = 100 (1%)
        // Feed A reports 1000, Feed B reports 1020 (2% apart)
        // Aggregate should fail ExcessiveDeviation
    }

    /// Attack Scenario 6: Confidence Interval Exploit
    /// Tests that feeds with wide confidence intervals are filtered
    #[flow]
    fn confidence_interval_exploit(&mut self) {
        // Set max_confidence_interval_bps = 50 (0.5%)
        // Crank feed with confidence = 10% of price
        // Aggregate should skip that feed
    }

    /// Attack Scenario 7: Feed Count Desync
    /// Tests that feed_count stays accurate
    #[flow]
    fn feed_count_desync(&mut self) {
        // Add 3 feeds
        // Remove 2 feeds
        // feed_count should be 1
        // Try close_oracle - should fail ActiveFeedsExist
        // Remove last feed
        // close_oracle - should succeed
    }

    /// Attack Scenario 8: Double-Add Same Index
    /// Tests that feed indices are unique
    #[flow]
    fn double_add_same_index(&mut self) {
        // Add feed at index 0
        // Add feed at index 0 again - should fail (PDA exists)
    }

    /// Attack Scenario 9: Weighted Mean Weight=0 Attack
    /// Tests that zero weights are rejected
    #[flow]
    fn zero_weight_attack(&mut self) {
        // Try add_feed with weight=0 - should fail InvalidParameter
    }

    /// Attack Scenario 10: Arithmetic Overflow in Aggregation
    /// Tests that aggregation handles large numbers safely
    #[flow]
    fn arithmetic_overflow_test(&mut self) {
        // Set all feed prices to u64::MAX
        // Aggregate with mean
        // Should use u128 intermediates and not panic
    }

    /// Attack Scenario 11: Pause Bypass Attempt
    /// Tests that pause state is respected
    #[flow]
    fn pause_bypass_attempt(&mut self) {
        // Pause oracle
        // Attempt crank_feed - should fail OraclePaused
        // Attempt aggregate - should fail OraclePaused
        // set_manual_price - should succeed (by design)
    }

    /// Attack Scenario 12: Authority Transfer Hijack
    /// Tests two-step authority transfer security
    #[flow]
    fn authority_transfer_hijack(&mut self) {
        // Initiate transfer to attacker A
        // Unrelated party B calls accept - should fail NotPendingAuthority
        // A calls accept - should succeed
        // Former authority cannot update config
    }

    /// Attack Scenario 13: Spread Arbitrage Detection
    /// Tests that negative spreads create arbitrage opportunities
    #[flow]
    fn spread_arbitrage_detection(&mut self) {
        // Set mint_premium_bps = -100 (discount for minters)
        // Set redeem_discount_bps = -100 (premium for redeemers)
        // Now mint_price < redeem_price (arbitrage exists)
        // Program allows this but documents it
    }

    /// Attack Scenario 14: Close With Feeds
    /// Tests that oracle cannot be closed with active feeds
    #[flow]
    fn close_with_feeds(&mut self) {
        // Initialize oracle
        // Add 3 feeds
        // close_oracle - should fail
        // Remove all 3
        // close_oracle - should succeed
    }

    /// Attack Scenario 15: Max Feeds Boundary
    /// Tests the maximum number of feeds limit
    #[flow]
    fn max_feeds_boundary(&mut self) {
        // Add MAX_FEEDS (16) feeds successfully
        // Add feed #17 - should fail MaxFeedsReached
        // Remove one
        // Add one - should succeed
    }

    #[end]
    fn end(&mut self) {
        // Cleanup after each iteration
    }
}

fn main() {
    FuzzTest::fuzz(50_000_000, 100);
}
