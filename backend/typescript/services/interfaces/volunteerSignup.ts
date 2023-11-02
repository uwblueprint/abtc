interface IVolunteerSignup {
    // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

   /**
   * Gets volunteer signup
   */
   getVolunteerSignup(id: string): Promise<void>;

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