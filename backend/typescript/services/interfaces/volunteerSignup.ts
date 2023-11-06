interface IVolunteerSignup {
    // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

   /**
   * Gets volunteer signup
   */
   getVolunteerSignup(): Promise<void>;

   /**
   * Posts volunteer signup
   */    
    postVolunteerSignup(): Promise<void>

   /**
   * Deletes volunteer signup
   */
   deleteVolunteerSignup(): Promise<void>

}
  
export default IVolunteerSignup;