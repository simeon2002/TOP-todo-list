# Todo List Project

# Learnings

- Using the MVC architecture to organize the code into responsibilities.
- There are two ways to update the dom:
  1. state change --> causes a full DOM re-render
  2. state change --> Specific incremental update
     no.1 is easier to reason. You get the 'state' and you display the 'state' through the `View`. \*\*Libraries use this (`declarative rendering`) as it's easier to reason about... state --> what UI you want to display in general.
     no.2 is a more performant. Here you the detailed change, so you change only this part of the `View` based on a specific state change. (e.g., a task is added to a project. Instead of re-rendering the full view, only the specific task will be added.)
