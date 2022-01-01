

class Action {
  constructor( overwriteDefaultBehaviors = false, {
    allowedConditions = [],

  }) {
    this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
    this.allowedConditions = allowedConditions;
  }


  /**
   * @method doOverwritenBahavior
   * @returns {Promise<boolean>}
   */
  async doOverwritenBahavior( condition, countNeeded ) {}
  /**
   * @method doAction
   * @param {*} condition 
   * @param {number} countNeeded
   * @returns {Promise<boolean>}
   */
  async doAction( condition, countNeeded ) {}
}

exports.Action = Action;