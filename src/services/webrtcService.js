let peerConnection = null;
let pendingCandidates = [];

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const createPeerConnection = () => {
  // Don't create another connection if one already exists
  if (peerConnection) {
    return peerConnection;
  }

  peerConnection = new RTCPeerConnection(configuration);

  return peerConnection;
};

export const getPeerConnection = () => {
  return peerConnection;
};

export const createOffer = async () => {
  const offer = await peerConnection.createOffer();

  await peerConnection.setLocalDescription(offer);

  return peerConnection.localDescription;
};

export const createAnswer = async () => {
  const answer = await peerConnection.createAnswer();

  await peerConnection.setLocalDescription(answer);

  return peerConnection.localDescription;
};

export const setRemoteDescription = async (description) => {
  if (!description || !peerConnection) return;

  if (!peerConnection.remoteDescription) {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(description),
    );
  }

  while (pendingCandidates.length) {
    const candidate = pendingCandidates.shift();

    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
};

export const addIceCandidate = async (candidate) => {
  if (!peerConnection || !candidate) return;

  if (peerConnection.remoteDescription) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } else {
    pendingCandidates.push(candidate);
  }
};

export const closePeerConnection = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
    pendingCandidates = [];
  }
};
