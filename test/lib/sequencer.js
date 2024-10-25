const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  /**
   * Select tests for shard requested via --shard=shardIndex/shardCount
   * Sharding is applied before sorting
   */
  shard(tests, { shardIndex, shardCount }) {
    const shardSize = Math.ceil(tests.length / shardCount);
    const shardStart = shardSize * (shardIndex - 1);
    const shardEnd = shardSize * shardIndex;

    return [...tests]
      .sort((a, b) => (a.path > b.path ? 1 : -1))
      .slice(shardStart, shardEnd);
  }

  /**
   * Sort test to determine order of execution
   * Sorting is applied after sharding
   */
  sort(tests) {
    // Test structure information
    // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
    const firstTests = tests.find(({ path }) => path.includes('/first.'));
    const lastTests = tests.find(({ path }) => path.includes('/last.'));
    const excludePath = []
      .concat(firstTests, lastTests)
      .filter(Boolean)
      .map(({ path }) => path);
    const copyTests = tests.filter(({ path }) => !excludePath.includes(path));

    return [].concat(
      firstTests,
      copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1)),
      lastTests,
    );
  }
}

module.exports = CustomSequencer;
