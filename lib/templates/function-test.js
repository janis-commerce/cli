'use strict';

const { getFilePath } = require('../fs/function-source');

module.exports = ({
	functionPath,
	functionName
}) => {

	return `'use strict';

    const sinon = require('sinon');
    
    const { handler: ${functionName} } = require(${getFilePath(functionPath, functionName)}');
    
    describe('Function {functionName}', () => {
      
          afterEach(() => {
            sinon.restore();
        });
    
        context('When event is invalid', () => {
          
          beforeEach(() => {
            // some spies maybe?
          });
    
          afterEach(() => {
            // some notCalled maybe?
          });
          
        });
    
        context('When event is valid', () => {
            
            const validEvent = {};
        });
    });`;
};
