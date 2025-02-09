 /**

  // State to hold the list of members
  const [members, setMembers] = useState<Member[]>([]);

  // Temporary state to hold the current member's input values
  const [currentMember, setCurrentMember] = useState<Member>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
  });
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;
    if (members.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, members.length, phoneNumber]);

  // Handle changes in the main form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target; // Destructure the target name and value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field in the form data
    }));
  };

  // Handle change for members
  const handleMemberChange = (field: keyof Member, value: string) => {
    setCurrentMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to add a member to the members list
  const handleAddAndInviteMember = async () => {
    if (
      currentMember.firstName &&
      currentMember.lastName &&
      currentMember.phoneNumber &&
      currentMember.nationalIdNo &&
      currentMember.memberRole
    ) {
      // Push the current member to the members array
      setMembers([...members, currentMember]);

      try {
        const daoMultiSigAddr = formData.multiSigAddr;
        // Send an email to the new member
        const response = await fetch(
          `http://${baseUrl}/DaoKit/MemberShip/InviteMemberEmail/$${daoMultiSigAddr}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `opensesame`,
            },
            body: JSON.stringify({
              email: currentMember.email,
              firstName: currentMember.firstName,
            }),
          }
        );

        if (response.ok) {
          alert("Member added and email sent successfully.");
        } else {
          console.error("Failed to send email.");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      // Clear the currentMember form for new input
      setCurrentMember({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        nationalIdNo: "",
        memberRole: "",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0]; // Access the file if it exists
    const fieldName = target.name;

    if (file) {
      const resourceType = fieldName === "daoImageIpfsHash" ? "image" : "raw"; // Use 'raw' for non-image files
      const fileUrl = await uploadFileToCloudinary(file, resourceType);

      if (fileUrl) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: fileUrl, // Update the specific field with the file URL
        }));
      }
    }
  };
 **/
