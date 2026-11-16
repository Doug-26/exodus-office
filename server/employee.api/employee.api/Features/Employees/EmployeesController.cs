using employee.api.Data;
using employee.api.Features.Employees.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace employee.api.Features.Employees;

[ApiController]
[Route("api/v1/employees")]
[Produces("application/json")]
public sealed class EmployeesController(EmployeeDbContext db) : ControllerBase
{
    /// <summary>Lists every employee ordered by name. Paging and filtering arrive in Phase 3.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<EmployeeResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<EmployeeResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var employees = await db.Employees
            .AsNoTracking()
            .OrderBy(e => e.Name)
            .Select(e => e.ToResponse())
            .ToListAsync(cancellationToken);

        return Ok(employees);
    }

    [HttpGet("{id:int}", Name = nameof(GetById))]
    [ProducesResponseType<EmployeeResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EmployeeResponse>> GetById(int id, CancellationToken cancellationToken)
    {
        var employee = await db.Employees.AsNoTracking().SingleOrDefaultAsync(e => e.Id == id, cancellationToken);

        return employee is null ? EmployeeNotFound(id) : Ok(employee.ToResponse());
    }

    [HttpPost]
    [ProducesResponseType<EmployeeResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<EmployeeResponse>> Create(CreateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var email = EmployeeMapper.NormalizeEmail(request.Email);
        if (await db.Employees.AnyAsync(e => e.Email == email, cancellationToken))
        {
            return EmailInUse(email);
        }

        var employee = request.ToEntity();
        db.Employees.Add(employee);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtRoute(nameof(GetById), new { id = employee.Id }, employee.ToResponse());
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType<EmployeeResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<EmployeeResponse>> Update(int id, UpdateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = await db.Employees.SingleOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (employee is null)
        {
            return EmployeeNotFound(id);
        }

        var email = EmployeeMapper.NormalizeEmail(request.Email);
        if (await db.Employees.AnyAsync(e => e.Email == email && e.Id != id, cancellationToken))
        {
            return EmailInUse(email);
        }

        request.ApplyTo(employee);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(employee.ToResponse());
    }

    /// <summary>Permanently removes an employee. Phase 1 adds deactivation as the ordinary path and restricts this to administrators.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var employee = await db.Employees.SingleOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (employee is null)
        {
            return EmployeeNotFound(id);
        }

        db.Employees.Remove(employee);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private ObjectResult EmployeeNotFound(int id) => Problem(
        statusCode: StatusCodes.Status404NotFound,
        title: "Employee not found",
        detail: $"No employee exists with ID {id}.");

    private ObjectResult EmailInUse(string email) => Problem(
        statusCode: StatusCodes.Status409Conflict,
        title: "Email already in use",
        detail: $"Another employee already uses {email}.");
}
