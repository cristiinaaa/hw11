(function(){
  var form = document.getElementById('contactForm');
  var alertBox = document.getElementById('formAlert');
  var wizardToggle = document.getElementById('wizardToggle');
  var steps = [].slice.call(document.querySelectorAll('.form-step'));

  function setGroupState(groupId, ok, msg){
    var group = document.getElementById('group-' + groupId);
    var help = document.getElementById('help-' + groupId);
    if(ok){
      group.classList.remove('has-error');
      group.classList.add('has-success');
      help.textContent = msg || 'Looks good.';
    }else{
      group.classList.remove('has-success');
      group.classList.add('has-error');
      help.textContent = msg || 'Please fix this field.';
    }
    return ok;
  }

  function isNonEmpty(v){ return !!v && v.trim().length > 0; }

  function validateName(value){
    if(!isNonEmpty(value)) return false;
    var re = /^[A-Za-z][A-Za-z'\-]{1,}$/;
    return re.test(value);
  }

  function validateSameMinLen(value, min){
    if(!isNonEmpty(value)) return false;
    return value.trim().length >= (min||6);
  }

  function validateEmail(value){
    var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validRegex.test(String(value).toLowerCase());
  }

  function validatePhone(value){
    var re = /^\d{10}$/;
    return re.test(value);
  }

  function validateComments(value){
    return isNonEmpty(value);
  }

  var fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    comments: document.getElementById('comments')
  };

  function runValidation(fieldKey){
    var v = fields[fieldKey].value;
    switch(fieldKey){
      case 'firstName':
        return setGroupState('firstName', validateName(v), "Only letters, hyphens, apostrophes; min 2.");
      case 'lastName':
        return setGroupState('lastName', validateName(v), "Only letters, hyphens, apostrophes; min 2.");
      case 'email':
        return setGroupState('email', validateEmail(v), "Enter a valid email.");
      case 'phone':
        return setGroupState('phone', validatePhone(v), "Exactly 10 digits; numbers only.");
      case 'username':
        return setGroupState('username', validateSameMinLen(v, 6), "At least 6 characters.");
      case 'password':
        return setGroupState('password', validateSameMinLen(v, 6), "At least 6 characters.");
      case 'comments':
        return setGroupState('comments', validateComments(v), "Cannot be empty.");
    }
    return false;
  }

  Object.keys(fields).forEach(function(k){
    ['input','blur'].forEach(function(evt){
      fields[k].addEventListener(evt, function(){ runValidation(k); });
    });
  });

  function showAlert(kind, msg){
    alertBox.className = 'alert alert-' + kind;
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var keys = Object.keys(fields);
    var allGood = keys.map(runValidation).every(function(x){ return x; });
    if(allGood){
      showAlert('success', 'Form is valid. Ready to submit.');
    }else{
      showAlert('danger', 'Please fix the errors and try again.');
    }
  });

  function setWizardMode(on){
    steps.forEach(function(step){ step.classList.add('hidden'); });
    document.querySelector('.form-step[data-step="1"]').classList.remove('hidden');
    var nextButtons = [].slice.call(document.querySelectorAll('.next-step'));
    var prevButtons = [].slice.call(document.querySelectorAll('.prev-step'));
    if(on){
      nextButtons.forEach(function(btn){
        btn.disabled = false;
        btn.addEventListener('click', handleNext);
      });
      prevButtons.forEach(function(btn){
        btn.disabled = false;
        btn.addEventListener('click', handlePrev);
      });
    }else{
      steps.forEach(function(step){ step.classList.remove('hidden'); });
      nextButtons.forEach(function(btn){
        btn.removeEventListener('click', handleNext);
      });
      prevButtons.forEach(function(btn){
        btn.removeEventListener('click', handlePrev);
      });
    }
  }

  function handleNext(e){
    var next = e.currentTarget.getAttribute('data-next');
    var currentStep = e.currentTarget.closest('.form-step');
    var ok = true;
    var inputs = [].slice.call(currentStep.querySelectorAll('input,textarea'));
    inputs.forEach(function(inp){ ok = runValidation(inp.id) && ok; });
    if(ok){
      currentStep.classList.add('hidden');
      document.querySelector('.form-step[data-step="'+next+'"]').classList.remove('hidden');
    }
  }

  function handlePrev(e){
    var prev = e.currentTarget.getAttribute('data-prev');
    var currentStep = e.currentTarget.closest('.form-step');
    currentStep.classList.add('hidden');
    document.querySelector('.form-step[data-step="'+prev+'"]').classList.remove('hidden');
  }

  wizardToggle.addEventListener('change', function(){
    if(wizardToggle.checked){
      setWizardMode(true);
    }else{
      setWizardMode(false);
    }
  });

  setWizardMode(false);
})();
