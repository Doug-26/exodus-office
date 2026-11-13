using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace employee.api.Models
{
    [Table("employeeMasterTbl")]
    public class EmployeeModel
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int empId { get; set; }
        [MaxLength(50)]
        [Required]
        public string empName { get; set; } = string.Empty;
        [MaxLength(10)]
        [MinLength(10)]
        [Required]
        public string empMobile { get; set; } = string.Empty;
        [MaxLength(50)]
        public string empEmail { get; set; } = string.Empty;
        [MaxLength(100)]
        public string city { get; set; } = string.Empty;
        [MaxLength(50)]
        public string region { get; set; } = string.Empty;
        [MaxLength(500)]
        public string address { get; set; } = string.Empty;
    }
}




