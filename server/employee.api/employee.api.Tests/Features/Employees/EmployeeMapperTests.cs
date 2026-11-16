using employee.api.Data.Entities;
using employee.api.Features.Employees;
using employee.api.Features.Employees.Contracts;

namespace employee.api.Tests.Features.Employees;

public class EmployeeMapperTests
{
    [Fact]
    public void ToEntity_trims_whitespace_and_lowercases_email()
    {
        var request = new CreateEmployeeRequest
        {
            Name = "  Maria Santos ",
            Mobile = " 9171234567 ",
            Email = " Maria.Santos@Example.com ",
            City = " Naga ",
            Region = " Bicol ",
            Address = " Concepcion Pequeña ",
        };

        var entity = request.ToEntity();

        Assert.Equal("Maria Santos", entity.Name);
        Assert.Equal("9171234567", entity.Mobile);
        Assert.Equal("maria.santos@example.com", entity.Email);
        Assert.Equal("Naga", entity.City);
        Assert.Equal("Bicol", entity.Region);
        Assert.Equal("Concepcion Pequeña", entity.Address);
    }

    [Fact]
    public void ApplyTo_replaces_every_editable_field_including_name()
    {
        var entity = new Employee
        {
            Id = 7,
            Name = "Old Name",
            Mobile = "9000000000",
            Email = "old@example.com",
            City = "Old City",
            Region = "Old Region",
            Address = "Old Address",
        };
        var request = new UpdateEmployeeRequest
        {
            Name = "New Name",
            Mobile = "9111111111",
            Email = "new@example.com",
            City = "New City",
            Region = "New Region",
            Address = "New Address",
        };

        request.ApplyTo(entity);

        Assert.Equal(7, entity.Id);
        Assert.Equal("New Name", entity.Name);
        Assert.Equal("9111111111", entity.Mobile);
        Assert.Equal("new@example.com", entity.Email);
        Assert.Equal("New City", entity.City);
        Assert.Equal("New Region", entity.Region);
        Assert.Equal("New Address", entity.Address);
    }

    [Fact]
    public void ToResponse_copies_every_field()
    {
        var entity = new Employee
        {
            Id = 3,
            Name = "Maria Santos",
            Mobile = "9171234567",
            Email = "maria.santos@example.com",
            City = "Naga",
            Region = "Bicol",
            Address = "Concepcion Pequeña",
        };

        var response = entity.ToResponse();

        Assert.Equal(new EmployeeResponse(3, "Maria Santos", "9171234567", "maria.santos@example.com", "Naga", "Bicol", "Concepcion Pequeña"), response);
    }
}
