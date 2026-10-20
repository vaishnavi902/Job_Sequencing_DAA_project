#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <limits>
using namespace std;

// DAA Mini Project: Job Sequencing with Deadlines
// Assumption: each job takes one unit of time and earns profit only
// when it is completed on or before its deadline.

struct Job {
    string id;
    int deadline;
    int profit;
};

bool compareProfit(const Job& a, const Job& b) {
    return a.profit > b.profit;
}

int main() {
    cout << "============================================\n";
    cout << "   JOB SEQUENCING WITH DEADLINES (DAA)\n";
    cout << "============================================\n";

    int n;
    cout << "Enter number of jobs: ";
    if (!(cin >> n) || n <= 0) {
        cout << "Please enter a positive number of jobs.\\n";
        return 1;
    }

    vector<Job> jobs(n);
    for (int i = 0; i < n; ++i) {
        cout << "\\nJob " << i + 1 << " ID: ";
        cin >> jobs[i].id;
        cout << "Deadline: ";
        cin >> jobs[i].deadline;
        cout << "Profit: ";
        cin >> jobs[i].profit;

        if (jobs[i].deadline <= 0 || jobs[i].profit <= 0) {
            cout << "Deadline and profit must be positive.\\n";
            return 1;
        }
    }

    sort(jobs.begin(), jobs.end(), compareProfit);

    int maxDeadline = 0;
    for (const Job& job : jobs)
        maxDeadline = max(maxDeadline, job.deadline);

    // There can be no more scheduled jobs than the number of jobs.
    const int slotCount = min(n, maxDeadline);
    vector<int> slot(slotCount + 1, -1);
    int totalProfit = 0;
    int jobsScheduled = 0;

    for (int i = 0; i < n; ++i) {
        int lastSlot = min(jobs[i].deadline, slotCount);
        for (int t = lastSlot; t >= 1; --t) {
            if (slot[t] == -1) {
                slot[t] = i;
                totalProfit += jobs[i].profit;
                ++jobsScheduled;
                break;
            }
        }
    }

    cout << "\\n\\n------------- FINAL SCHEDULE -------------\\n";
    cout << "Time Slot\\tJob ID\\tProfit\\n";
    for (int t = 1; t <= slotCount; ++t) {
        cout << t << "\\t\\t";
        if (slot[t] == -1) {
            cout << "Empty\\t—\\n";
        } else {
            const Job& job = jobs[slot[t]];
            cout << job.id << "\\t" << job.profit << "\\n";
        }
    }

    cout << "------------------------------------------\\n";
    cout << "Jobs scheduled : " << jobsScheduled << "\\n";
    cout << "Jobs skipped   : " << n - jobsScheduled << "\\n";
    cout << "Maximum profit : " << totalProfit << "\\n";
    cout << "\\nTime complexity: O(n log n + nD)\\n";
    cout << "Space complexity: O(n + D)\\n";
    cout << "D = maximum usable deadline.\\n";

    return 0;
}
