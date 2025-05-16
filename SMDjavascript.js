        function initializeData() {
            if (!localStorage.getItem('shipMaintenanceData')) {
                const mockData = {
                    users: [
                        { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
                        { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123" },
                        { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123" }
                    ],
                    ships: [
                        { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active" },
                        { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance" }
                    ],
                    components: [
                        { id: "c1", shipId: "s1", name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12" },
                        { id: "c2", shipId: "s2", name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01" }
                    ],
                    jobs: [
                        { id: "j1", componentId: "c1", shipId: "s1", type: "Inspection", priority: "High", status: "Open", assignedEngineerId: "3", scheduledDate: "2025-05-05" }
                    ],
                    notifications: [],
                    currentUser: null
                };
                localStorage.setItem('shipMaintenanceData', JSON.stringify(mockData));
            }
        }

        function getData() {
            return JSON.parse(localStorage.getItem('shipMaintenanceData')) || {};
        }

        function saveData(data) {
            localStorage.setItem('shipMaintenanceData', JSON.stringify(data));
        }        const loginPage = document.getElementById('login-page');
        const mainApp = document.getElementById('main-app');
        const loginForm = document.getElementById('login-form');
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const loginError = document.getElementById('login-error');
        const logoutBtn = document.getElementById('logout-btn');
        const currentUserRole = document.getElementById('current-user-role');
        

        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');

        const totalShipsEl = document.getElementById('total-ships');
        const overdueComponentsEl = document.getElementById('overdue-components');
        const jobsInProgressEl = document.getElementById('jobs-in-progress');
        const jobsCompletedEl = document.getElementById('jobs-completed');
        const recentJobsTable = document.getElementById('recent-jobs-table').querySelector('tbody');
        const shipsTable = document.getElementById('ships-table').querySelector('tbody');
        const addShipBtn = document.getElementById('add-ship-btn');
        const addShipModal = document.getElementById('add-ship-modal');
        const addShipForm = document.getElementById('add-ship-form');
        const editShipModal = document.getElementById('edit-ship-modal');
        const editShipForm = document.getElementById('edit-ship-form');        
       
        const shipDetailPage = document.getElementById('ship-detail-page');
        const backToShipsBtn = document.getElementById('back-to-ships-btn');
        const shipDetailName = document.getElementById('ship-detail-name');
        const shipImo = document.getElementById('ship-imo');
        const shipFlag = document.getElementById('ship-flag');
        const shipStatus = document.getElementById('ship-status');
        const componentsTable = document.getElementById('components-table').querySelector('tbody');
        const addComponentBtn = document.getElementById('add-component-btn');
        const addComponentModal = document.getElementById('add-component-modal');
        const addComponentForm = document.getElementById('add-component-form');
        const componentShipId = document.getElementById('component-ship-id');
        const shipJobsTable = document.getElementById('ship-jobs-table').querySelector('tbody');
     
        const jobsTable = document.getElementById('jobs-table').querySelector('tbody');
        const addJobBtn = document.getElementById('add-job-btn');
        const addJobModal = document.getElementById('add-job-modal');
        const addJobForm = document.getElementById('add-job-form');
        const jobComponentSelect = document.getElementById('job-component');
        const jobEngineerSelect = document.getElementById('job-engineer');
        const updateJobModal = document.getElementById('update-job-modal');
        const updateJobForm = document.getElementById('update-job-form');
    
        const currentMonthYear = document.getElementById('current-month-year');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        const calendarGrid = document.getElementById('calendar-grid');
        const dayJobsModal = document.getElementById('day-jobs-modal');
        const dayJobsTitle = document.getElementById('day-jobs-title');
        const dayJobsList = document.getElementById('day-jobs-list');
     
        const notificationsList = document.getElementById('notifications-list');
        const closeButtons = document.querySelectorAll('.close-btn');

        let currentView = {
            currentShipId: null,
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear()
        };        function init() {
            initializeData();            loginForm.addEventListener('submit', handleLogin);
            logoutBtn.addEventListener('click', handleLogout);
               navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPage(link.dataset.page);
                    
       
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            });       addShipBtn.addEventListener('click', () => showModal(addShipModal));
            addShipForm.addEventListener('submit', handleAddShip);
            editShipForm.addEventListener('submit', handleEditShip);
          
            backToShipsBtn.addEventListener('click', () => showPage('ships'));
            addComponentBtn.addEventListener('click', () => showModal(addComponentModal));
            addComponentForm.addEventListener('submit', handleAddComponent);
     
            addJobBtn.addEventListener('click', () => {
                populateComponentSelect();
                populateEngineerSelect();
                showModal(addJobModal);
            });
            addJobForm.addEventListener('submit', handleAddJob);
            updateJobForm.addEventListener('submit', handleUpdateJob);
    
            prevMonthBtn.addEventListener('click', () => {
                if (currentView.currentMonth === 0) {
                    currentView.currentMonth = 11;
                    currentView.currentYear--;
                } else {
                    currentView.currentMonth--;
                }
                renderCalendar();
            });
            
            nextMonthBtn.addEventListener('click', () => {
                if (currentView.currentMonth === 11) {
                    currentView.currentMonth = 0;
                    currentView.currentYear++;
                } else {
                    currentView.currentMonth++;
                }
                renderCalendar();
            });
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modal = btn.closest('.modal');
                    hideModal(modal);
                });
            });
            const data = getData();
            if (data.currentUser) {
                showApp();
            } else {
                showLogin();
            }
        }
        function showLogin() {
            loginPage.classList.remove('hidden');
            mainApp.classList.add('hidden');
        }
        function showApp() {
            loginPage.classList.add('hidden');
            mainApp.classList.remove('hidden');
            
            const data = getData();
            currentUserRole.textContent = data.currentUser.role;
            showPage('dashboard');
        }     function showPage(pageId) {
            pages.forEach(page => {
                if (page.id === `${pageId}-page`) {
                    page.classList.remove('hidden');
                } else {
                    page.classList.add('hidden');
                }
            });
            switch (pageId) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'ships':
                    loadShips();
                    break;
                case 'jobs':
                    loadJobs();
                    break;
                case 'calendar':
                    renderCalendar();
                    break;
                case 'notifications':
                    loadNotifications();
                    break;
            }
        }
        function showModal(modal) {
            modal.classList.remove('hidden');
        }

        function hideModal(modal) {
            modal.classList.add('hidden');
        }
       function handleLogin(e) {
            e.preventDefault();
            
            const email = loginEmail.value;
            const password = loginPassword.value;
            
            const data = getData();
            const user = data.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                data.currentUser = user;
                saveData(data);
                addNotification(`User ${user.email} logged in`, 'System');
                
                showApp();
            } else {
                loginError.textContent = 'Invalid email or password';
                loginError.classList.remove('hidden');
            }
        }
       function handleLogout() {
            const data = getData();
             if (data.currentUser) {
                addNotification(`User ${data.currentUser.email} logged out`, 'System');
            }
            
            data.currentUser = null;
            saveData(data);
            
            showLogin();
        }
        function loadDashboard() {
            const data = getData();
            totalShipsEl.textContent = data.ships?.length || 0;
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            const overdueComponents = data.components?.filter(comp => {
                const lastMaintenance = new Date(comp.lastMaintenanceDate);
                return lastMaintenance < sixMonthsAgo;
            }).length || 0;
            
            overdueComponentsEl.textContent = overdueComponents;
            const jobsInProgress = data.jobs?.filter(job => job.status === 'In Progress').length || 0;
            jobsInProgressEl.textContent = jobsInProgress;
              const jobsCompleted = data.jobs?.filter(job => job.status === 'Completed').length || 0;
            jobsCompletedEl.textContent = jobsCompleted;
                recentJobsTable.innerHTML = '';
            const recentJobs = data.jobs?.slice(0, 5) || [];
            
            recentJobs.forEach(job => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${job.id}</td>
                    <td>${job.type}</td>
                    <td>${job.priority}</td>
                    <td>${job.status}</td>
                    <td>${job.scheduledDate}</td>
                `;
                
                recentJobsTable.appendChild(row);
            });
        }
        function loadShips() {
            const data = getData();
            shipsTable.innerHTML = '';
            
            data.ships?.forEach(ship => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${ship.name}</td>
                    <td>${ship.imo}</td>
                    <td>${ship.flag}</td>
                    <td>${ship.status}</td>
                    <td>
                        <button class="btn btn-primary view-ship-btn" data-id="${ship.id}">View</button>
                        ${data.currentUser?.role === 'Admin' ? `
                            <button class="btn btn-secondary edit-ship-btn" data-id="${ship.id}">Edit</button>
                            <button class="btn btn-danger delete-ship-btn" data-id="${ship.id}">Delete</button>
                        ` : ''}
                    </td>
                `;
                
                shipsTable.appendChild(row);
            });
            document.querySelectorAll('.view-ship-btn').forEach(btn => {
                btn.addEventListener('click', () => viewShip(btn.dataset.id));
            });
            
            document.querySelectorAll('.edit-ship-btn').forEach(btn => {
                btn.addEventListener('click', () => editShip(btn.dataset.id));
            });
            
            document.querySelectorAll('.delete-ship-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteShip(btn.dataset.id));
            });
        }
        function viewShip(shipId) {
            const data = getData();
            const ship = data.ships.find(s => s.id === shipId);
            
            if (!ship) return;
            currentView.currentShipId = shipId;
           shipDetailName.textContent = ship.name;
            shipImo.textContent = ship.imo;
            shipFlag.textContent = ship.flag;
            shipStatus.textContent = ship.status;
            componentShipId.value = shipId;
            loadComponents();
            loadShipJobs();
            showPage('ship-detail');
        }
        function loadComponents() {
            const data = getData();
            componentsTable.innerHTML = '';
            
            const shipComponents = data.components?.filter(c => c.shipId === currentView.currentShipId) || [];
            
            shipComponents.forEach(comp => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${comp.name}</td>
                    <td>${comp.serialNumber}</td>
                    <td>${comp.installDate}</td>
                    <td>${comp.lastMaintenanceDate}</td>
                    <td>
                        ${data.currentUser?.role === 'Admin' ? `
                            <button class="btn btn-danger delete-component-btn" data-id="${comp.id}">Delete</button>
                        ` : ''}
                    </td>
                `;
                
                componentsTable.appendChild(row);
            });
            document.querySelectorAll('.delete-component-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteComponent(btn.dataset.id));
            });
        }     function loadShipJobs() {
            const data = getData();
            shipJobsTable.innerHTML = '';
            
            const shipJobs = data.jobs?.filter(job => {
                const component = data.components?.find(c => c.id === job.componentId);
                return component?.shipId === currentView.currentShipId;
            }) || [];            shipJobs.forEach(job => {
                const component = data.components?.find(c => c.id === job.componentId);              const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${job.id}</td>
                    <td>${component?.name || 'N/A'}</td>
                    <td>${job.type}</td>
                    <td>${job.priority}</td>
                    <td>${job.status}</td>
                    <td>${job.scheduledDate}</td>
                `;                shipJobsTable.appendChild(row);
            });
        }
        function loadJobs() {
            const data = getData();
            jobsTable.innerHTML = '';
            data.jobs?.forEach(job => {
                const component = data.components?.find(c => c.id === job.componentId);
                const ship = component ? data.ships?.find(s => s.id === component.shipId) : null;
                const engineer = data.users?.find(u => u.id === job.assignedEngineerId);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${job.id}</td>
                    <td>${ship?.name || 'N/A'}</td>
                    <td>${component?.name || 'N/A'}</td>
                    <td>${job.type}</td>
                    <td>${job.priority}</td>
                    <td>${job.status}</td>
                    <td>${engineer?.email || 'Unassigned'}</td>
                    <td>${job.scheduledDate}</td>
                    <td>
                        ${data.currentUser?.role === 'Engineer' && job.status !== 'Completed' ? `
                            <button class="btn btn-primary update-job-btn" data-id="${job.id}">Update</button>
                        ` : ''}
                    </td>
                `;
                
                jobsTable.appendChild(row);
            });
            document.querySelectorAll('.update-job-btn').forEach(btn => {
                btn.addEventListener('click', () => prepareUpdateJob(btn.dataset.id));
            });
        }
        function prepareUpdateJob(jobId) {
            const data = getData();
            const job = data.jobs?.find(j => j.id === jobId);
            
            if (!job) return;
            
            document.getElementById('update-job-id').value = jobId;
            document.getElementById('update-job-status').value = job.status;
            
            showModal(updateJobModal);
        }
        function handleAddShip(e) {
            e.preventDefault();
            
            const data = getData();
            
            const newShip = {
                id: 's' + (data.ships.length + 1),
                name: document.getElementById('ship-name').value,
                imo: document.getElementById('ship-imo').value,
                flag: document.getElementById('ship-flag').value,
                status: document.getElementById('ship-status').value
            };
            
            data.ships.push(newShip);
            saveData(data);
               addNotification(`New ship added: ${newShip.name}`, 'System');
              addShipForm.reset();
            hideModal(addShipModal);
               loadShips();
        }
        function editShip(shipId) {
            const data = getData();
            const ship = data.ships.find(s => s.id === shipId);
            
            if (!ship) return;
            
            document.getElementById('edit-ship-id').value = shipId;
            document.getElementById('edit-ship-name').value = ship.name;
            document.getElementById('edit-ship-imo').value = ship.imo;
            document.getElementById('edit-ship-flag').value = ship.flag;
            document.getElementById('edit-ship-status').value = ship.status;
            
            showModal(editShipModal);
        }
        function handleEditShip(e) {
            e.preventDefault();            const data = getData();
            const shipId = document.getElementById('edit-ship-id').value;
            const shipIndex = data.ships.findIndex(s => s.id === shipId);
            if (shipIndex === -1) return;
            data.ships[shipIndex] = {
                ...data.ships[shipIndex],
                name: document.getElementById('edit-ship-name').value,
                imo: document.getElementById('edit-ship-imo').value,
                flag: document.getElementById('edit-ship-flag').value,
                status: document.getElementById('edit-ship-status').value
            };
            
            saveData(data);
            addNotification(`Ship updated: ${data.ships[shipIndex].name}`, 'System');
            hideModal(editShipModal);

            if (currentView.currentShipId === shipId) {
                viewShip(shipId);
            } else {
                loadShips();
            }
        }        function deleteShip(shipId) {
            if (!confirm('Are you sure you want to delete this ship? All associated components and jobs will also be deleted.')) {
                return;
            }
            
            const data = getData();
            const ship = data.ships.find(s => s.id === shipId);
            
            if (!ship) return;
               data.ships = data.ships.filter(s => s.id !== shipId);
            data.components = data.components.filter(c => c.shipId !== shipId);
            const componentIds = data.components.filter(c => c.shipId === shipId).map(c => c.id);
            data.jobs = data.jobs.filter(j => !componentIds.includes(j.componentId));
            
            saveData(data);
            addNotification(`Ship deleted: ${ship.name}`, 'System');
            loadShips();
        }
        function handleAddComponent(e) {
            e.preventDefault();  
            const data = getData();

            const newComponent = {
                id: 'c' + (data.components.length + 1),
                shipId: document.getElementById('component-ship-id').value,
                name: document.getElementById('component-name').value,
                serialNumber: document.getElementById('component-serial').value,
                installDate: document.getElementById('component-install-date').value,
                lastMaintenanceDate: document.getElementById('component-last-maintenance').value
            };
            
            data.components.push(newComponent);
            saveData(data);
            addNotification(`New component added to ship: ${newComponent.name}`, 'System');
             addComponentForm.reset();
            hideModal(addComponentModal);
                 loadComponents();
        }     function deleteComponent(componentId) {
            if (!confirm('Are you sure you want to delete this component? All associated jobs will also be deleted.')) {
                return;
            }
            
            const data = getData();
            const component = data.components.find(c => c.id === componentId);
            
            if (!component) return;            data.components = data.components.filter(c => c.id !== componentId);
                        data.jobs = data.jobs.filter(j => j.componentId !== componentId);
            
            saveData(data);
            addNotification(`Component deleted: ${component.name}`, 'System');
            loadComponents();
            loadShipJobs();
        }
        function populateComponentSelect() {
            const data = getData();
            jobComponentSelect.innerHTML = '<option value="">Select Component</option>';
            data.components?.forEach(comp => {
                const ship = data.ships?.find(s => s.id === comp.shipId);
                const option = document.createElement('option');
                option.value = comp.id;
                option.textContent = `${comp.name} (Ship: ${ship?.name || 'Unknown'})`;
                jobComponentSelect.appendChild(option);
            });
        }
        function populateEngineerSelect() {
            const data = getData();
            jobEngineerSelect.innerHTML = '<option value="">Select Engineer</option>';
            
            data.users?.filter(u => u.role === 'Engineer').forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.email;
                jobEngineerSelect.appendChild(option);
            });
        }
        function handleAddJob(e) {
            e.preventDefault();
            const data = getData();
            const componentId = document.getElementById('job-component').value;
            const component = data.components?.find(c => c.id === componentId);
            
            const newJob = {
                id: 'j' + (data.jobs.length + 1),
                componentId: componentId,
                shipId: component?.shipId,
                type: document.getElementById('job-type').value,
                priority: document.getElementById('job-priority').value,
                status: document.getElementById('job-status').value,
                assignedEngineerId: document.getElementById('job-engineer').value,
                scheduledDate: document.getElementById('job-scheduled-date').value
            };
            
            data.jobs.push(newJob);
            addNotification(`New maintenance job created: ${newJob.type}`, 'System');
            
            saveData(data);
              addJobForm.reset();
            hideModal(addJobModal);
             if (currentView.currentShipId) {
                loadShipJobs();
            } else {
                loadJobs();
            }
            if (document.getElementById('calendar-page').classList.contains('hidden') === false) {
                renderCalendar();
            }
        }
        function handleUpdateJob(e) {
            e.preventDefault();
            
            const data = getData();
            const jobId = document.getElementById('update-job-id').value;
            const newStatus = document.getElementById('update-job-status').value;
            
            const jobIndex = data.jobs.findIndex(j => j.id === jobId);
            
            if (jobIndex === -1) return;
            
            const oldStatus = data.jobs[jobIndex].status;
            data.jobs[jobIndex].status = newStatus;
            
            saveData(data);            addNotification(`Job ${jobId} status changed from ${oldStatus} to ${newStatus}`, 'System');
            
            hideModal(updateJobModal);
            if (currentView.currentShipId) {
                loadShipJobs();
            } else {
                loadJobs();
            }
        }
        function renderCalendar() {
            const data = getData();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            currentMonthYear.textContent = `${monthNames[currentView.currentMonth]} ${currentView.currentYear}`;
            const firstDay = new Date(currentView.currentYear, currentView.currentMonth, 1).getDay();
            const daysInMonth = new Date(currentView.currentYear, currentView.currentMonth + 1, 0).getDate();
            calendarGrid.innerHTML = '';
               for (let i = 0; i < firstDay; i++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day empty';
                calendarGrid.appendChild(dayCell);
            }
               for (let i = 1; i <= daysInMonth; i++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                
                const dateStr = `${currentView.currentYear}-${String(currentView.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const jobsOnDay = data.jobs?.filter(job => job.scheduledDate === dateStr);
                
                if (jobsOnDay?.length) {
                    dayCell.classList.add('has-jobs');
                    
                    const indicator = document.createElement('span');
                    indicator.className = 'job-indicator';
                    indicator.textContent = jobsOnDay.length;
                    
                    dayCell.innerHTML = `
                        <div class="day-number">${i}</div>
                    `;
                    dayCell.appendChild(indicator);
                    
                    dayCell.addEventListener('click', () => showDayJobs(dateStr, jobsOnDay));
                } else {
                    dayCell.innerHTML = `
                        <div class="day-number">${i}</div>
                    `;
                }
                
                calendarGrid.appendChild(dayCell);
            }
        }

        function showDayJobs(dateStr, jobs) {
            const data = getData();
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            dayJobsTitle.textContent = `Jobs on ${formattedDate}`;
            dayJobsList.innerHTML = '';
            
            jobs.forEach(job => {
                const component = data.components?.find(c => c.id === job.componentId);
                const ship = component ? data.ships?.find(s => s.id === component.shipId) : null;
                
                const jobEl = document.createElement('div');
                jobEl.className = 'notification';
                jobEl.innerHTML = `
                    <h3>${job.type} - ${job.priority}</h3>
                    <p>Status: ${job.status}</p>
                    ${component ? `<p>Component: ${component.name}</p>` : ''}
                    ${ship ? `<p>Ship: ${ship.name}</p>` : ''}
                    <small>Job ID: ${job.id}</small>
                `;
                
                dayJobsList.appendChild(jobEl);
            });
            
            showModal(dayJobsModal);
        }
        function loadNotifications() {
            const data = getData();
            notificationsList.innerHTML = '';
            
            if (!data.notifications?.length) {
                notificationsList.innerHTML = '<p>No notifications</p>';
                return;
            }            const sortedNotifications = [...data.notifications].sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            sortedNotifications.forEach(notif => {
                const notifEl = document.createElement('div');
                notifEl.className = `notification ${notif.read ? '' : 'unread'}`;
                
                notifEl.innerHTML = `
                    <h3>${notif.type}</h3>
                    <p>${notif.message}</p>
                    <small>${new Date(notif.timestamp).toLocaleString()}</small>
                    <div class="notification-actions">
                        ${!notif.read ? `<button class="btn btn-primary mark-read-btn" data-id="${notif.id}">Mark as Read</button>` : ''}
                        <button class="btn btn-danger dismiss-btn" data-id="${notif.id}">Dismiss</button>
                    </div>
                `;
                
                notificationsList.appendChild(notifEl);
            });
             document.querySelectorAll('.mark-read-btn').forEach(btn => {
                btn.addEventListener('click', () => markNotificationAsRead(btn.dataset.id));
            });
            
            document.querySelectorAll('.dismiss-btn').forEach(btn => {
                btn.addEventListener('click', () => dismissNotification(btn.dataset.id));
            });
        }
        function addNotification(message, type) {
            const data = getData();
            
            const newNotification = {
                id: 'n' + (data.notifications.length + 1),
                type: type,
                message: message,
                read: false,
                timestamp: new Date().toISOString()
            };
            
            data.notifications.push(newNotification);
            saveData(data);
        }
        function markNotificationAsRead(notificationId) {
            const data = getData();
            const notifIndex = data.notifications.findIndex(n => n.id === notificationId);
            
            if (notifIndex === -1) return;
            
            data.notifications[notifIndex].read = true;
            saveData(data);
            loadNotifications();
        }        function dismissNotification(notificationId) {
            const data = getData();
            data.notifications = data.notifications.filter(n => n.id !== notificationId);
            saveData(data);
              loadNotifications();
        }
        document.addEventListener('DOMContentLoaded', init);
