// Sample data structure for the Question Management System
// This mimics the structure from the Codolio API

export const sampleData = {
  success: true,
  data: {
    sheetName: "DSA Interview Preparation Sheet",
    topics: [
      {
        _id: "topic-1",
        topicName: "Arrays",
        order: 0,
        subTopics: [
          {
            _id: "subtopic-1-1",
            subTopicName: "Easy",
            order: 0,
            questions: [
              {
                _id: "q-1",
                questionName: "Two Sum",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/two-sum/",
                order: 0,
                completed: false
              },
              {
                _id: "q-2",
                questionName: "Best Time to Buy and Sell Stock",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
                order: 1,
                completed: false
              },
              {
                _id: "q-3",
                questionName: "Contains Duplicate",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/contains-duplicate/",
                order: 2,
                completed: false
              },
              {
                _id: "q-4",
                questionName: "Product of Array Except Self",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/product-of-array-except-self/",
                order: 3,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-1-2",
            subTopicName: "Medium",
            order: 1,
            questions: [
              {
                _id: "q-5",
                questionName: "3Sum",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/3sum/",
                order: 0,
                completed: false
              },
              {
                _id: "q-6",
                questionName: "Container With Most Water",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/container-with-most-water/",
                order: 1,
                completed: false
              },
              {
                _id: "q-7",
                questionName: "Maximum Subarray",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/maximum-subarray/",
                order: 2,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-1-3",
            subTopicName: "Hard",
            order: 2,
            questions: [
              {
                _id: "q-8",
                questionName: "Trapping Rain Water",
                difficulty: "Hard",
                link: "https://leetcode.com/problems/trapping-rain-water/",
                order: 0,
                completed: false
              },
              {
                _id: "q-9",
                questionName: "Median of Two Sorted Arrays",
                difficulty: "Hard",
                link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
                order: 1,
                completed: false
              }
            ]
          }
        ]
      },
      {
        _id: "topic-2",
        topicName: "Strings",
        order: 1,
        subTopics: [
          {
            _id: "subtopic-2-1",
            subTopicName: "Easy",
            order: 0,
            questions: [
              {
                _id: "q-10",
                questionName: "Valid Anagram",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/valid-anagram/",
                order: 0,
                completed: false
              },
              {
                _id: "q-11",
                questionName: "Valid Palindrome",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/valid-palindrome/",
                order: 1,
                completed: false
              },
              {
                _id: "q-12",
                questionName: "Reverse String",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/reverse-string/",
                order: 2,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-2-2",
            subTopicName: "Medium",
            order: 1,
            questions: [
              {
                _id: "q-13",
                questionName: "Longest Substring Without Repeating Characters",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
                order: 0,
                completed: false
              },
              {
                _id: "q-14",
                questionName: "Longest Palindromic Substring",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/longest-palindromic-substring/",
                order: 1,
                completed: false
              },
              {
                _id: "q-15",
                questionName: "Group Anagrams",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/group-anagrams/",
                order: 2,
                completed: false
              }
            ]
          }
        ]
      },
      {
        _id: "topic-3",
        topicName: "Linked Lists",
        order: 2,
        subTopics: [
          {
            _id: "subtopic-3-1",
            subTopicName: "Easy",
            order: 0,
            questions: [
              {
                _id: "q-16",
                questionName: "Reverse Linked List",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/reverse-linked-list/",
                order: 0,
                completed: false
              },
              {
                _id: "q-17",
                questionName: "Merge Two Sorted Lists",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/merge-two-sorted-lists/",
                order: 1,
                completed: false
              },
              {
                _id: "q-18",
                questionName: "Linked List Cycle",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/linked-list-cycle/",
                order: 2,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-3-2",
            subTopicName: "Medium",
            order: 1,
            questions: [
              {
                _id: "q-19",
                questionName: "Add Two Numbers",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/add-two-numbers/",
                order: 0,
                completed: false
              },
              {
                _id: "q-20",
                questionName: "Remove Nth Node From End of List",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
                order: 1,
                completed: false
              }
            ]
          }
        ]
      },
      {
        _id: "topic-4",
        topicName: "Trees",
        order: 3,
        subTopics: [
          {
            _id: "subtopic-4-1",
            subTopicName: "Easy",
            order: 0,
            questions: [
              {
                _id: "q-21",
                questionName: "Maximum Depth of Binary Tree",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
                order: 0,
                completed: false
              },
              {
                _id: "q-22",
                questionName: "Invert Binary Tree",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/invert-binary-tree/",
                order: 1,
                completed: false
              },
              {
                _id: "q-23",
                questionName: "Same Tree",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/same-tree/",
                order: 2,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-4-2",
            subTopicName: "Medium",
            order: 1,
            questions: [
              {
                _id: "q-24",
                questionName: "Binary Tree Level Order Traversal",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
                order: 0,
                completed: false
              },
              {
                _id: "q-25",
                questionName: "Validate Binary Search Tree",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/validate-binary-search-tree/",
                order: 1,
                completed: false
              },
              {
                _id: "q-26",
                questionName: "Kth Smallest Element in a BST",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
                order: 2,
                completed: false
              }
            ]
          }
        ]
      },
      {
        _id: "topic-5",
        topicName: "Dynamic Programming",
        order: 4,
        subTopics: [
          {
            _id: "subtopic-5-1",
            subTopicName: "1D DP",
            order: 0,
            questions: [
              {
                _id: "q-27",
                questionName: "Climbing Stairs",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/climbing-stairs/",
                order: 0,
                completed: false
              },
              {
                _id: "q-28",
                questionName: "House Robber",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/house-robber/",
                order: 1,
                completed: false
              },
              {
                _id: "q-29",
                questionName: "Coin Change",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/coin-change/",
                order: 2,
                completed: false
              },
              {
                _id: "q-30",
                questionName: "Longest Increasing Subsequence",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/longest-increasing-subsequence/",
                order: 3,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-5-2",
            subTopicName: "2D DP",
            order: 1,
            questions: [
              {
                _id: "q-31",
                questionName: "Unique Paths",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/unique-paths/",
                order: 0,
                completed: false
              },
              {
                _id: "q-32",
                questionName: "Longest Common Subsequence",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/longest-common-subsequence/",
                order: 1,
                completed: false
              },
              {
                _id: "q-33",
                questionName: "Edit Distance",
                difficulty: "Hard",
                link: "https://leetcode.com/problems/edit-distance/",
                order: 2,
                completed: false
              }
            ]
          }
        ]
      },
      {
        _id: "topic-6",
        topicName: "Graphs",
        order: 5,
        subTopics: [
          {
            _id: "subtopic-6-1",
            subTopicName: "BFS/DFS",
            order: 0,
            questions: [
              {
                _id: "q-34",
                questionName: "Number of Islands",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/number-of-islands/",
                order: 0,
                completed: false
              },
              {
                _id: "q-35",
                questionName: "Clone Graph",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/clone-graph/",
                order: 1,
                completed: false
              },
              {
                _id: "q-36",
                questionName: "Pacific Atlantic Water Flow",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
                order: 2,
                completed: false
              }
            ]
          },
          {
            _id: "subtopic-6-2",
            subTopicName: "Advanced",
            order: 1,
            questions: [
              {
                _id: "q-37",
                questionName: "Course Schedule",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/course-schedule/",
                order: 0,
                completed: false
              },
              {
                _id: "q-38",
                questionName: "Network Delay Time",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/network-delay-time/",
                order: 1,
                completed: false
              }
            ]
          }
        ]
      }
    ]
  }
};