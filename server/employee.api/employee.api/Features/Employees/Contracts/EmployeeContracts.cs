using System.ComponentModel.DataAnnotations;
using employee.api.Data;

namespace employee.api.Features.Employees.Contracts;

/// <summary>Public shape of an employee returned by every employee endpoint.</summary>
public sealed record EmployeeResponse(
    int Id,
    string Name,
    string Mobile,
    string Email,
    string City,
    string Region,
    string Address);

/// <summary>Body of <c>POST /api/v1/employees</c>.</summary>
public sealed record CreateEmployeeRequest
{
    [Required, StringLength(EmployeeLimits.NameMaxLength, MinimumLength = 2)]
    public required string Name { get; init; }

    [Required, RegularExpression(EmployeeValidation.MobilePattern, ErrorMessage = EmployeeValidation.MobileMessage)]
    public required string Mobile { get; init; }

    [Required, EmailAddress, StringLength(EmployeeLimits.EmailMaxLength)]
    public required string Email { get; init; }

    [Required, StringLength(EmployeeLimits.CityMaxLength)]
    public required string City { get; init; }

    [Required, StringLength(EmployeeLimits.RegionMaxLength)]
    public required string Region { get; init; }

    [Required, StringLength(EmployeeLimits.AddressMaxLength)]
    public required string Address { get; init; }
}

/// <summary>Body of <c>PUT /api/v1/employees/{id}</c>. Every field is replaced.</summary>
public sealed record UpdateEmployeeRequest
{
    [Required, StringLength(EmployeeLimits.NameMaxLength, MinimumLength = 2)]
    public required string Name { get; init; }

    [Required, RegularExpression(EmployeeValidation.MobilePattern, ErrorMessage = EmployeeValidation.MobileMessage)]
    public required string Mobile { get; init; }

    [Required, EmailAddress, StringLength(EmployeeLimits.EmailMaxLength)]
    public required string Email { get; init; }

    [Required, StringLength(EmployeeLimits.CityMaxLength)]
    public required string City { get; init; }

    [Required, StringLength(EmployeeLimits.RegionMaxLength)]
    public required string Region { get; init; }

    [Required, StringLength(EmployeeLimits.AddressMaxLength)]
    public required string Address { get; init; }
}

public static class EmployeeValidation
{
    /// <summary>Philippine mobile number: 10 digits starting with 9, without the +63 prefix.</summary>
    public const string MobilePattern = "^9[0-9]{9}$";
    public const string MobileMessage = "Mobile must be 10 digits starting with 9, for example 9171234567.";
}
