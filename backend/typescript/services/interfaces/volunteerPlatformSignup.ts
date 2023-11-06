interface IVolunteerPlatformSignup {
    // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

   /**
   * Gets volunteer signup
   */
   getVolunteerPlatformSignup(): Promise<void>;

   /**
   * Posts volunteer signup
   */    
    postVolunteerPlatformSignup(): Promise<void>

   /**
   * Edits volunteer signup
   */
    editVolunteerPlatformSignup(): Promise<void>

}
  
export default IVolunteerPlatformSignup;