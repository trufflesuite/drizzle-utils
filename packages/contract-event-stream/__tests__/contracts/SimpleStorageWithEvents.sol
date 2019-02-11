pragma solidity ^0.5.1;

contract SimpleStorageWithEvents {
  uint public storedData = 0;
  event Update(uint storedData);

  function set(uint x) public {
    storedData = x;
    emit Update(storedData);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
