using System.ComponentModel.DataAnnotations;
using employee.api.Features.Employees.Contracts;

namespace employee.api.Tests.Features.Employees;

public class CreateEmployeeRequestValidationTests
{
    [Fact]
    public void Valid_request_has_no_validation_errors()
    {
        var errors = Validate(ValidRequest());

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData("0917123456")]
    [InlineData("917123456")]
    [InlineData("91712345678")]
    [InlineData("+639171234567")]
    [InlineData("abcdefghij")]
    public void Mobile_must_be_ten_digits_starting_with_nine(string mobile)
    {
        var errors = Validate(ValidRequest() with { Mobile = mobile });

        var error = Assert.Single(errors);
        Assert.Contains(nameof(CreateEmployeeRequest.Mobile), error.MemberNames);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("missing-at.example.com")]
    public void Email_must_be_an_email_address(string email)
    {
        var errors = Validate(ValidRequest() with { Email = email });

        var error = Assert.Single(errors);
        Assert.Contains(nameof(CreateEmployeeRequest.Email), error.MemberNames);
    }

    [Fact]
    public void Name_shorter_than_two_characters_is_rejected()
    {
        var errors = Validate(ValidRequest() with { Name = "A" });

        var error = Assert.Single(errors);
        Assert.Contains(nameof(CreateEmployeeRequest.Name), error.MemberNames);
    }

    private static CreateEmployeeRequest ValidRequest() => new()
    {
        Name = "Maria Santos",
        Mobile = "9171234567",
        Email = "maria.santos@example.com",
        City = "Naga",
        Region = "Bicol",
        Address = "Concepcion Pequeña",
    };

    private static List<ValidationResult> Validate(object request)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(request, new ValidationContext(request), results, validateAllProperties: true);
        return results;
    }
}
