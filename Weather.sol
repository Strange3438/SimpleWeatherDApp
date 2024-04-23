// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2;

contract Weather {
    string public cityName;

    event CitySet(string cityName);

    function setCityName(string memory _name) public {
        cityName = _name;
        emit CitySet(_name);
    }
}