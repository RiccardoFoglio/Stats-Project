let matchNode = function (theNode, nameStr) {
  if (theNode === null){
    return theNode;
  }
  if (theNode.nodeName === nameStr) {
    return theNode;
  } else {
    return null;
  }
};

let firstNode = function (theNode, nameStr) {
  
  if (theNode.firstChild !== null && theNode.firstChild.nodeType === 1){
    if (matchNode(theNode.firstChild, nameStr) !== null) {
      return theNode.firstChild;
    } else {
      return firstNode(theNode.firstChild, nameStr);
    }
  } else {
    return null;
  }
};

let siblingNode = function(theNode, nameStr) {
  let returnNode = theNode.nextSibling;
  if (returnNode !== null){
    returnNode = matchNode(returnNode, nameStr);
  } else {
    return null;
  }
  if (returnNode !== null){
    return returnNode;
  } else {
    return siblingNode(theNode.nextSibling, nameStr);
  }
};


  let teamOne = firstNode(xml, 'team') // first team object
  let firstLinescore = firstNode(xml, 'linescore')
  let teamTwo = siblingNode(teamOne, 'team') // second team object

  console.log(teamOne)
  console.log(teamTwo)

// x.getElementsByTagName()[].firstChild
// x.getElementsByTagName()[].lastChild
