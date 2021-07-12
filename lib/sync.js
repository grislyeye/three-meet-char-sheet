const offerModal = document.getElementById("offer-modal")
const linkOutput = document.getElementById("link-output")
const acceptAnswerModal = document.getElementById("accept-answer-modal")
const answerInput = document.getElementById("answer-input")
const acceptOfferModal = document.getElementById("accept-offer-modal")
const offerInput = document.getElementById("offer-input")
const answerModal = document.getElementById("answer-modal")
const answerLinkOutput = document.getElementById("answer-link-output")

const peer = new SimplePeer({
  initiator: location.hash === '#1',
  trickle: false
})

peer.on('error', err => console.log('error', err))

peer.on('signal', signal => {
  console.log('SIGNAL', JSON.stringify(signal))
  if (signal.type === 'offer') {
    linkOutput.value = btoa(JSON.stringify(signal))
    offerModal.visible = true
  } else {
    answerLinkOutput.value = btoa(JSON.stringify(signal))
    answerModal.visible = true
  }
})

peer.on('data', data => {
  console.log('data: ' + data)
})

function showAcceptOffer() {
  acceptOfferModal.visible = true
}

function acceptOffer() {
  acceptOfferModal.visible = false
  const offer =  JSON.parse(atob(offerInput.value))
  peer.signal(offer)
  answerModal.visible = true
}

function showAcceptAnswer() {
  offerModal.visible = false
  acceptAnswerModal.visible = true
}

function acceptAnswer() {
  acceptAnswerModal.visible = false
  const answer =  JSON.parse(atob(answerInput.value))
  peer.signal(answer)
}

window.peer = peer
window.showAcceptOffer = showAcceptOffer
window.acceptOffer = acceptOffer
window.showAcceptAnswer = showAcceptAnswer
window.acceptAnswer = acceptAnswer
