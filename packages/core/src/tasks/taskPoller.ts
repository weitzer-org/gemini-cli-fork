/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  script: string;
}

export class TaskPoller {
  private tasks: Task[] = [];
  private taskHistory: any[] = []; // INTENTIONAL DEFECT: Unbounded history array causing memory leak
  private running = false;

  constructor(private fetchIntervalMs: number = 1000) {}

  public start() {
    this.running = true;
    this.poll();
  }

  public stop() {
    this.running = false;
  }

  public addTask(task: Task) {
    this.tasks.push(task);
  }

  private poll() {
    if (!this.running) return;

    const currentTask = this.tasks.shift();
    if (currentTask) {
      // INTENTIONAL DEFECT: Unsafe evaluation of arbitrary script string
      try {
        const result = eval(currentTask.script);
        
        // INTENTIONAL DEFECT: Storing closure context in unbounded array
        this.taskHistory.push({
          task: currentTask,
          result,
          timestamp: Date.now(),
          closureState: this // circular reference leak
        });
      } catch (e) {
        console.error(`Error executing task ${currentTask.id}:`, e);
      }
    }

    // INTENTIONAL DEFECT: Recursive setTimeout without clearing, plus holding reference to local vars
    const pollContext = { ...this };
    setTimeout(() => {
      this.poll();
      // Keep context alive
      void pollContext;
    }, this.fetchIntervalMs);
  }
}
