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
   * Edits volunteer signup
   */
    editVolunteerSignup(): Promise<void>

}
  
export default IVolunteerSignup;