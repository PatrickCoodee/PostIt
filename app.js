// storage
const StorageCtrl = (() => {
  // storage goes here
})()


//Object Cotrol
const LogCtrl = (() => {

  // data structure
  const Log = function(id,title,private,body,logdate) {
    this.id = id
    this.title = title,
    this.private = private,
    this.body = body,
    this.logdate = logdate
  }

  const data = {
    logs: [
      {
        id: 'asda',
        title: 'This is pre entereed',
        private: true,
        body: 'This is the body',
        logdate: 'now'
      }
    ],
    currentLog: null
  }

  // return public vars and methods
  return {

    addLog: (input) => {
      // initialize id of new log
      const id = uuidv4()
      const logDate = moment().valueOf()
     
      // create new Log object
      const newLog = new Log(id,input.title,input.isHidden,input.body,logDate)

      // push to data list
      data.logs.push(newLog)

      // return new object
      return newLog
    },
    setCurrentLog: (log) => {
      data.currentLog = log
    },
    getCurrentLog: () => {
      return data.currentLog
    },
    getLog: (log) => {
      const logID = log.getAttribute('id')

      return data.logs.find(log => {
        return log.id === logID
      })
    },
    updateLog: (title,isHidden,body) => {

      const updateTimeStamp = moment().valueOf()
      
      let found 

      data.logs.forEach( log => {
        // find current log and update
        if ( log.id === data.currentLog.id) {
          // update item
          log.title = title,
          log.private = isHidden,
          log.logdate = updateTimeStamp,
          log.body = body
          // set log to the current log
          found = log
        }
      })

      return found
    },
    deleteLog: (id) => {
      data.logs.forEach((log,index) => {
        if (log.id === id) {
          data.logs.splice(index,1)
        }
      })

    },
    getLogs: () => {
      return data.logs
    },
    logData: () => {
      console.log(data)
    }
  }
})()

// UI Component
const UICtrl = (() => {

  const UISelectors = {
    addBtn : '.btn-add',
    deleteBtn: '.btn-delete',
    editSaveBtn: '.btn-edit-save',
    backBtn: '.btn-back',
    titleInput: '#log-title',
    bodyInput: '#log-body',
    isHidden: '#hide-story',
    logList: '#log-list',
    viewTitle: '#view-log-title',
    viewBody: '#view-log-body',
    addStateTitle: '#add-log-title',
    editStateTitle: '#edit-log-title',
    logItem: '.log-item'
  }


  // return public vars and methods
  return {
    getSelectors: () => {
      return UISelectors
    },
    getInput: () => {
      return {
        // get and return inpunts from the UI
        title : document.querySelector(UISelectors.titleInput).value,
        body: document.querySelector(UISelectors.bodyInput).value,
        isHidden: document.querySelector(UISelectors.isHidden).checked
      }
    },
    addLogToUI: (log) => {

      const div = document.createElement('div')
      const timeStamp = moment(log.logdate).format("MMMM Do YYYY, h:mm:ss a")
      div.className = 'col-sm-4 my-3 log-item'

      div.id = log.id
      
        
      div.innerHTML = `
      
      <div class="card bg-secondary text-white">
        <div class="card-body">
          <h4 class="card-title text-capitalize font-weight-bold">${log.title}</h4>
          <span class="text-white">${timeStamp}</span>
          <div class="py-2">
           <a href="#" class="btn btn-view btn-primary"><i class="fas fa-eye"></i> View</a>
           <a href="#" class="btn btn-edit btn-warning"><i class="fas fa-edit"></i> Edit</a>
           
        </div>
        </div>
      </div>
      `
      // insert to main log list
      document.querySelector(UISelectors.logList).insertAdjacentElement('beforeend',div)
    },
    clearInputs: () => {
       document.querySelector(UISelectors.titleInput).value = ''
       document.querySelector(UISelectors.bodyInput).value = ''
       document.querySelector(UISelectors.isHidden).checked = false
    },
    showInitialState: () => {

      UICtrl.clearInputs()
      document.querySelector(UISelectors.addStateTitle).style.display = 'block'
      document.querySelector(UISelectors.addBtn).style.display = 'block'

      document.querySelector(UISelectors.editStateTitle).style.display = 'none'
      document.querySelector(UISelectors.editSaveBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
    },
    closeAddModal: () => {
      $('#AddLogModal').modal('hide');
      UICtrl.clearInputs()
      UICtrl.showInitialState()
      
    },
    showLogModal: () => {
      $('#viewLogModal').modal('show')
    },
    showEditState: () => {
      document.querySelector(UISelectors.editStateTitle).style.display = 'block'
      document.querySelector(UISelectors.editSaveBtn).style.display = 'block'
      document.querySelector(UISelectors.deleteBtn).style.display = 'block'

      document.querySelector(UISelectors.addStateTitle).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    showLogToEdit: (logToEdit) => {

      UICtrl.showEditState()

      document.querySelector(UISelectors.isHidden).checked = LogCtrl.getCurrentLog().private
      document.querySelector(UISelectors.titleInput).value = LogCtrl.getCurrentLog().title
      document.querySelector(UISelectors.bodyInput).value = LogCtrl.getCurrentLog().body
      // open add modal
      $('#AddLogModal').modal('show');
    },
    updateLogList: (updatedLog) => {
      // get all log items
      let logs = document.querySelectorAll(UISelectors.logItem)
      let timeStamp = moment(updatedLog.logdate).format("MMMM Do YYYY, h:mm:ss a")
      // convert nodelist to array
      logs = Array.from(logs)  
     
      
      // find log to update
      logs.forEach( log => {
        // get id of each log
        const logID = log.getAttribute('id')
     
        // check if id match for updated log
        if (logID === updatedLog.id) {
          // update log
          document.getElementById(logID).innerHTML = `
          <div class="card bg-secondary text-white">
          <div class="card-body">
            <h4 class="card-title text-capitalize font-weight-bold">${updatedLog.title}</h4>
            <span class="text-white">${timeStamp}</span>
            <div class="py-2">
             <a href="#" class="btn btn-view btn-primary"><i class="fas fa-eye"></i> View</a>
             <a href="#" class="btn btn-edit btn-warning"><i class="fas fa-edit"></i> Edit</a>
          </div>
          </div>
          </div>
          `
          UICtrl.closeAddModal()
        }
      })
      
    },
    populateLogList: (logs) => {
      logs.forEach(log => {
        UICtrl.addLogToUI(log)
      })
    },
    clearError: () => {
      if (document.querySelector('.err-message')) {
        document.querySelector('.err-message').remove()
      }
      
    },
    showError: (err) => {

      UICtrl.clearError()
      // create a div
      const errDiv = document.createElement('div')

      // add class 
      errDiv.className = 'alert bg-danger text-dark err-message'

      errDiv.innerHTML = ` <h4 class="font-weight-bold text-center">${err}: Title and Body cannot be blank</h4>`

      const modalBody = document.querySelector('.add-modal-body')

      document.querySelector('.modal-content').insertBefore(errDiv,modalBody)

      setTimeout(UICtrl.clearError, 3000)
    },
    deleteLogFromUI: (id) => {
      const log = document.getElementById(id)
      log.remove()
    },
    isInputValid: (uiInput) => {
      return uiInput.title === '' || uiInput.body === '' ? false : true
    },
    viewLog: (log) => {
      // supply log data to info
      document.querySelector(UISelectors.viewTitle).textContent = log.title
      document.querySelector(UISelectors.viewBody).innerHTML = `
        <p class="lead">${log.body}</p>
      `
      // open a modal
      UICtrl.showLogModal()
    }
  }
})()


// Main controller
const app = ((UICtrl, LogCtrl)=> {

  const UISelectors = UICtrl.getSelectors()

  loadEventListeners = function() {
    // add event delegation on modal
    document.querySelector(UISelectors.addBtn).addEventListener('click', clickAddLog)

    // add event delegation on log list
    document.querySelector(UISelectors.logList).addEventListener('click', clickViewEditLog)

    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.closeAddModal)

    // save edit log
    document.querySelector(UISelectors.editSaveBtn).addEventListener('click', updateLogEntry)

    // delete button
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', clickDeleteLog)
  }
  
  const clickAddLog = (e) => {
      e.preventDefault()
      // get input from the modal
      const input = UICtrl.getInput()
      
      const isValid = UICtrl.isInputValid(input)
      
      // validate input
      if(!isValid) {
        // show error here
        UICtrl.showError('Error Adding Log')
      } else {
        // create a new log data
        const newLog = LogCtrl.addLog(input)

        // add to UI
        UICtrl.addLogToUI(newLog)

        // clear inputs
        UICtrl.clearInputs()

        // close Modal
        UICtrl.closeAddModal()
 
      }
  }

  const clickViewEditLog = (e) => {
    
    // parent element
    const logParent = e.target.parentNode.parentNode.parentNode.parentNode
    
    // check if what element was clicked
    if(e.target.classList.contains('btn-view')) {
      
      const log = LogCtrl.getLog(logParent)

      UICtrl.viewLog(log) //pass id
      
    }

    if (e.target.classList.contains('btn-edit')) {
      
      const logtoEdit = LogCtrl.getLog(logParent)

      LogCtrl.setCurrentLog(logtoEdit)

      UICtrl.showLogToEdit(logtoEdit)

    }
  }


  const updateLogEntry = () => {
    
    // get currentItem on edit modal
    const currentLog = UICtrl.getInput()

    const isUpdateValid = UICtrl.isInputValid(currentLog)
    
    if (!isUpdateValid) {
      UICtrl.showError('Error Updating Log')
    } else {
      // update current log
      const updatedLog = LogCtrl.updateLog(currentLog.title, currentLog.isHidden, currentLog.body)
    
      UICtrl.updateLogList(updatedLog)
    }
    
  }


  const clickDeleteLog = (e) => {
    e.preventDefault()

    const itemToDelete = LogCtrl.getCurrentLog()
    // deleteLog from array
    LogCtrl.deleteLog(itemToDelete.id)

    UICtrl.deleteLogFromUI(itemToDelete.id)

    UICtrl.closeAddModal()
    
  }

  return {
    init: () => {
      console.log('Initializing Application..')

      // show initial state on loading
      UICtrl.showInitialState()
      const logs = LogCtrl.getLogs()
      UICtrl.populateLogList(logs)
      // load event listeners
      loadEventListeners()
    }
  }
})(UICtrl,LogCtrl)

app.init()