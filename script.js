// 在文件开头添加数据加载函数
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        todos.forEach(task => {
            const tasksContainer = document.querySelector(`#${task.category} .tasks`);
            const taskElement = createTaskElement(task);
            insertTaskInOrder(tasksContainer, taskElement, task.date);
        });
    }
}

// 保存待办事项到 localStorage
function saveTodos() {
    const todos = [];
    document.querySelectorAll('.task').forEach(taskElement => {
        const id = taskElement.id.replace('task-', '');
        const category = taskElement.closest('.todo-list').id;
        const text = taskElement.querySelector('.task-content').textContent;
        const date = taskElement.getAttribute('data-date');
        const completed = taskElement.classList.contains('completed');
        
        // 获取备注内容
        const noteElement = taskElement.querySelector('.task-note');
        let note = '';
        if (noteElement) {
            const noteItems = noteElement.querySelectorAll('li');
            note = Array.from(noteItems).map(li => li.textContent).join('\n');
        }

        todos.push({
            id,
            text,
            date,
            note,
            completed,
            category
        });
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 切换标签的功能
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有标签的active类
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.todo-list').forEach(list => list.classList.remove('active'));
        
        // 添加active类到当前选中的标签
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// 添加新待办事项
function addTodo() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const categorySelect = document.getElementById('categorySelect');
    const noteInput = document.getElementById('noteInput');
    
    if (!taskInput.value.trim()) {
        alert('请输入任务名称！');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        date: dateInput.value,
        note: noteInput.value.trim(),
        completed: false,
        category: categorySelect.value
    };

    const tasksContainer = document.querySelector(`#${task.category} .tasks`);
    const taskElement = createTaskElement(task);
    
    insertTaskInOrder(tasksContainer, taskElement, task.date);

    // 保存到 localStorage
    saveTodos();

    // 清空输入
    taskInput.value = '';
    dateInput.value = '';
    noteInput.value = '';
}

// 添加按日期排序插入任务的函数
function insertTaskInOrder(container, newTaskElement, newDate) {
    const tasks = Array.from(container.children);
    
    if (tasks.length === 0 || !newDate) {
        container.appendChild(newTaskElement);
        return;
    }

    const newDateTime = new Date(newDate).getTime();
    
    for (let i = 0; i < tasks.length; i++) {
        const taskDate = tasks[i].getAttribute('data-date');
        if (!taskDate || new Date(taskDate).getTime() > newDateTime) {
            container.insertBefore(newTaskElement, tasks[i]);
            return;
        }
    }
    
    container.appendChild(newTaskElement);
}

// 创建任务元素
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.id = `task-${task.id}`;
    taskDiv.setAttribute('data-date', task.date);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskComplete(taskDiv));

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    taskContent.textContent = task.text;

    const taskDate = document.createElement('div');
    taskDate.className = 'task-date';
    taskDate.textContent = task.date ? new Date(task.date).toLocaleDateString() : '';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => deleteTask(task.id);

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(taskDate);
    taskDiv.appendChild(deleteButton);

    // 如果有备注，添加备注显示
    if (task.note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'task-note';
        
        // 将备注文本按换行符分割成数组
        const noteLines = task.note.split('\n').filter(line => line.trim());
        
        // 如果有多行，创建无序列表
        if (noteLines.length > 0) {
            const ul = document.createElement('ul');
            noteLines.forEach(line => {
                const li = document.createElement('li');
                li.textContent = line.trim();
                ul.appendChild(li);
            });
            noteDiv.appendChild(ul);
        }
        
        taskDiv.appendChild(noteDiv);
    }

    return taskDiv;
}

// 切换任务完成状态
function toggleTaskComplete(taskElement) {
    taskElement.classList.toggle('completed');
    saveTodos(); // 保存更改
}

// 删除任务
function deleteTask(taskId) {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
        taskElement.remove();
        saveTodos(); // 保存更改
    }
}

// 在文件末尾添加页面加载时的初始化
document.addEventListener('DOMContentLoaded', loadTodos); 