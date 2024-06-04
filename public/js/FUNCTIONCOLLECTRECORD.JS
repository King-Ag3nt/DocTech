export const collectMainEntri = entiri => {
  const seaction = document.getElementById(entiri)
  const entries = seaction.getElementsByClassName('twoinputs')
  const finish = []
  for (const entry of entries) {
    const titleInput = entry.querySelector('textarea[placeholder="Type"]')
    const commentInput = entry.querySelector('textarea[placeholder="Comment"]')
    finish.push({
      title: titleInput.value,
      comment: commentInput.value,
    })
  }
  return finish
}

export const collectDMD = () => {
  const seaction = document.getElementById('DMDContainer')
  if (seaction) {
    const entries = seaction.getElementsByClassName('DMDinputs')
    const finish = []
    for (const entry of entries) {
      const titleInput = entry.querySelector('.titleInput').value
      const commentInput = entry.querySelector('.Description').value
      const startedAt = entry.querySelector('.DMDSAT').value
      const onGoing = entry.querySelector('.form-check-input[name="DMD"]').checked
      const endedAt = entry.querySelector('.DMDEAT').value
      const causeOfDC = entry.querySelector('.causeOfDC').value
      const adherenceStatus = entry.querySelector('.adherenceStatus').value
      const dc = Array.from(entry.querySelectorAll('.valueofDuration, .typeoftheDuration'))
        .map(element => element.value.trim())
        .join(' ')
      const why = entry.querySelector('.whytheadherence').value
      const labs = entry.querySelector('.Labs').value
      const clinic = entry.querySelector('.Clinic').value

      finish.push({
        Type: titleInput,
        description: commentInput,
        startedAt: startedAt,
        onGoing: onGoing,
        endedAt: endedAt,
        causeOfDC: causeOfDC,
        adherence: {
          status: adherenceStatus,
          dc: dc,
          why: why,
        },
        adverseEvents: {
          clinic: clinic,
          labs: labs,
        },
      })
    }
    return finish
  } else {
    console.error("Element with ID 'DMDContainer' not found.")
  }
}

export const VitalInformations = () => {
  const finish = []

  const weight = getValueWithType('#weight', '.weighttype')
  const height = getValueWithType('#height', '.heighttype')
  const bloodPressure = getValueWithType('#bloodPressure', '.bloodPressuretype')
  const pulseRate = getValueWithType('#pulseRate', '.pulseRatetype')
  // const temperature = getValueWithType('#temperature', '.temperaturetype')
  const bloodSugar = getValueWithType('#bloodSugar', '.bloodSugartype')
  // const respirationRateElement = document.querySelector('.respirationRate')
  // const oxygenSaturationElement = document.querySelector('.oxygenSaturation')
  const dateofthevitalElement = document.querySelector('.dateofthevital')

  // const respirationRate = respirationRateElement ? respirationRateElement.value : ''
  // const oxygenSaturation = oxygenSaturationElement ? oxygenSaturationElement.value : ''
  const dateofthevital = dateofthevitalElement ? dateofthevitalElement.value : ''

  finish.push({
    weight,
    height,
    bloodPressure,
    pulseRate,
    bloodSugar,
    date: dateofthevital,
  })

  console.log(finish)
  return finish
}

function getValueWithType(idSelector, typeSelector) {
  const valueElement = document.querySelector(idSelector)
  const typeElement = document.querySelector(typeSelector)

  const value = valueElement ? valueElement.value : ''
  const type = typeElement ? typeElement.value : ''

  return `${value} ${type}`
}

export const collectMedicationnew = () => {
  const seaction = document.getElementById('medicationsContainer')
  const entries = seaction.getElementsByClassName('fourinputs')
  const finish = []
  for (const entry of entries) {
    const titleInput = entry.querySelector('textarea[placeholder="Type"]')
    const commentInput = entry.querySelector('textarea[placeholder="Comment"]')
    const startedAt = entry.querySelector('input[placeholder="Started At"]')
    const endedAt = entry.querySelector('input[placeholder="Ended At"]')
    finish.push({
      title: titleInput.value,
      description: commentInput.value,
      startedAt: startedAt.value,
      endedAt: endedAt.value,
    })
  }
  return finish
}
