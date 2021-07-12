window.threeMeetConnections = {}

const
  configuration = {
    iceServers: [
      { urls: "stun:stun.stunprotocol.org" }
    ]
  }

window.threeMeetConnections.localConnection = new RTCPeerConnection(configuration)

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const code = params['offer']

if(code) {
  const offer = JSON.parse(atob(code))
  await window.threeMeetConnections.localConnection.setRemoteDescription(offer)

  const answer = await window.threeMeetConnections.localConnection.createAnswer()
  await window.threeMeetConnections.localConnection.setLocalDescription(answer)

  const answerModal = document.getElementById("answer-modal")
  const awnserLinkOutput = document.getElementById("answer-link-output")
  const answerCode = btoa(JSON.stringify(answer))

  awnserLinkOutput.value = answerCode
  answerModal.visible = true
}

const offerModal = document.getElementById("offer-modal")

async function createOffer() {
  const linkOutput = document.getElementById("link-output")

  window.threeMeetConnections.channel = await window.threeMeetConnections.localConnection.createDataChannel("char-sheet-updates")

  window.threeMeetConnections.channel.onmessage = function (event) {
    console.log("received: " + event.data);
  };

  window.threeMeetConnections.channel.onopen = function () {
    console.log("datachannel open");
  };

  window.threeMeetConnections.channel.onclose = function () {
    console.log("datachannel close");
  };

  const offer = await window.threeMeetConnections.localConnection.createOffer()
  await window.threeMeetConnections.localConnection.setLocalDescription(offer)

  const code = btoa(JSON.stringify(offer))

  linkOutput.value = `${window.location}?offer=${code}`
  offerModal.visible = true
}

const acceptAnswerModal = document.getElementById("accept-answer-modal")

async function showAcceptAnswer() {
  offerModal.visible = false
  acceptAnswerModal.visible = true
}

async function acceptAnswer() {
  acceptAnswerModal.visible = false
  const answerInput = document.getElementById("answer-input")
  const answer = JSON.parse(atob(answerInput.value))
  window.threeMeetConnections.localConnection.setRemoteDescription(answer)
}

window.createOffer = createOffer
window.showAcceptAnswer = showAcceptAnswer
window.acceptAnswer = acceptAnswer
