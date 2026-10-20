const jobs = [];
let lastResult = null;

const $ = (id) => document.getElementById(id);
const form = $("jobForm");

function showMessage(text = "", success = false) {
  const el = $("message");
  el.textContent = text;
  el.style.color = success ? "#168765" : "#c34e5a";
}

function renderJobs() {
  const body = $("jobsBody");
  body.innerHTML = "";
  $("emptyJobs").style.display = jobs.length ? "none" : "block";

  jobs.forEach((job, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="job-pill">${escapeHtml(job.id)}</span></td>
      <td>${job.deadline}</td>
      <td>${job.profit.toLocaleString()}</td>
      <td style="text-align:right"><button class="delete-btn" type="button" data-index="${index}" aria-label="Delete ${escapeHtml(job.id)}">Remove</button></td>`;
    body.appendChild(tr);
  });
  body.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      jobs.splice(Number(btn.dataset.index), 1);
      renderJobs();
      resetResults();
      showMessage("Job removed.", true);
    });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function resetResults() {
  lastResult = null;
  $("totalProfit").textContent = "—";
  $("scheduledCount").textContent = "—";
  $("skippedCount").textContent = "—";
  $("resultBadge").textContent = "Not run yet";
  $("resultBadge").className = "tag tag-muted";
  $("timeline").innerHTML = '<p class="muted">Run the algorithm to view your schedule.</p>';
  $("scheduleBody").innerHTML = "";
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const id = $("jobId").value.trim();
  const deadline = Number($("deadline").value);
  const profit = Number($("profit").value);

  if (!id) return showMessage("Please enter a job ID.");
  if (jobs.some(job => job.id.toLowerCase() === id.toLowerCase()))
    return showMessage("Job IDs must be unique.");
  if (!Number.isInteger(deadline) || deadline < 1 || deadline > 1000)
    return showMessage("Deadline must be a whole number from 1 to 1000.");
  if (!Number.isSafeInteger(profit) || profit <= 0)
    return showMessage("Profit must be a positive whole number.");

  jobs.push({ id, deadline, profit });
  renderJobs();
  resetResults();
  form.reset();
  $("jobId").focus();
  showMessage(`${id} added successfully.`, true);
});

$("sampleBtn").addEventListener("click", () => {
  jobs.splice(0, jobs.length,
    { id: "J1", deadline: 2, profit: 100 },
    { id: "J2", deadline: 1, profit: 19 },
    { id: "J3", deadline: 2, profit: 27 },
    { id: "J4", deadline: 1, profit: 25 },
    { id: "J5", deadline: 3, profit: 15 }
  );
  renderJobs();
  runAlgorithm();
  showMessage("Sample jobs loaded and scheduled.", true);
});

$("clearBtn").addEventListener("click", () => {
  jobs.length = 0;
  renderJobs();
  resetResults();
  showMessage("All jobs cleared.", true);
});

$("runBtn").addEventListener("click", runAlgorithm);

function runAlgorithm() {
  if (!jobs.length) {
    resetResults();
    return showMessage("Add at least one job before running the algorithm.");
  }

  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.min(jobs.length, Math.max(...jobs.map(j => j.deadline)));
  const slots = Array(maxDeadline + 1).fill(null);
  const scheduledIds = new Set();
  let totalProfit = 0;
  let comparisons = 0;

  for (const job of sorted) {
    for (let t = Math.min(job.deadline, maxDeadline); t >= 1; t--) {
      comparisons++;
      if (slots[t] === null) {
        slots[t] = job;
        scheduledIds.add(job.id);
        totalProfit += job.profit;
        break;
      }
    }
  }

  const schedule = [];
  for (let t = 1; t <= maxDeadline; t++) {
    schedule.push({ slot: t, job: slots[t] });
  }

  lastResult = { schedule, totalProfit, scheduledIds, comparisons };
  renderResults(lastResult);
  showMessage("Scheduling completed successfully.", true);
}

function renderResults(result) {
  const skipped = jobs.filter(j => !result.scheduledIds.has(j.id));
  $("totalProfit").textContent = result.totalProfit.toLocaleString();
  $("scheduledCount").textContent = result.scheduledIds.size;
  $("skippedCount").textContent = skipped.length;
  $("resultBadge").textContent = "Completed";
  $("resultBadge").className = "tag";

  const timeline = $("timeline");
  timeline.innerHTML = "";
  result.schedule.forEach(({ slot, job }) => {
    const div = document.createElement("div");
    div.className = "slot" + (job ? "" : " empty");
    div.innerHTML = `<span class="slot-label">TIME SLOT ${slot}</span>
      <strong>${job ? escapeHtml(job.id) : "Empty"}</strong>
      <small>${job ? "Profit: " + job.profit.toLocaleString() : "No job assigned"}</small>`;
    timeline.appendChild(div);
  });

  const body = $("scheduleBody");
  body.innerHTML = "";
  result.schedule.forEach(({ slot, job }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${slot}</td>
      <td>${job ? `<span class="job-pill">${escapeHtml(job.id)}</span>` : '<span class="skipped-text">Empty</span>'}</td>
      <td class="${job ? "profit-text" : ""}">${job ? job.profit.toLocaleString() : "—"}</td>`;
    body.appendChild(tr);
  });

  if (skipped.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3" class="skipped-text">Not scheduled: ${skipped.map(j => escapeHtml(j.id)).join(", ")}</td>`;
    body.appendChild(tr);
  }
}

renderJobs();
