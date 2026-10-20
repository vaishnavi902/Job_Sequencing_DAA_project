# Job Sequencing with Deadlines — DAA Mini Project

A small project for demonstrating the Greedy Algorithm using job deadlines and profits.

## Files
- `index.html` — browser UI
- `style.css` — styling and responsive layout
- `script.js` — working interactive browser demonstration
- `main.cpp` — standalone C++ implementation for DAA submission

## Run the UI
1. Extract the ZIP file.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Click **Load sample** or enter your own jobs.
4. Click **Run scheduling algorithm** to view the schedule and total profit.

The browser UI works locally and does not need installation or a server. It runs the same greedy scheduling logic in JavaScript so the UI is immediately usable. The standalone C++ implementation is in `main.cpp` and can be compiled separately.

## Compile the C++ program
With g++:
```bash
g++ -std=c++17 -O2 main.cpp -o job_sequencing
```
Run on Windows:
```bash
job_sequencing.exe
```
On Linux/macOS:
```bash
./job_sequencing
```

## Sample input
```text
5
J1 2 100
J2 1 19
J3 2 27
J4 1 25
J5 3 15
```

Expected maximum profit: `142`
One valid schedule is slot 1 = J3, slot 2 = J1, slot 3 = J5.

## Algorithm
1. Sort jobs by descending profit.
2. For each job, search backward from its deadline for the latest free slot.
3. Schedule it if a free slot exists; otherwise skip it.
4. Add the profit of each scheduled job.

## Complexity
Let `n` be the number of jobs and `D` be the maximum usable deadline.
- Time: `O(n log n + nD)`
- Space: `O(n + D)`

## Assumptions
Each job takes one unit of time. A job earns its profit only if it is scheduled by its deadline. Job IDs should be unique. This is a basic educational implementation using a greedy slot-search approach.
