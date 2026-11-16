using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace employee.api.Data.Migrations
{
    /// <summary>
    /// Stores mobile numbers in E.164 format (+639XXXXXXXXX) instead of 10 bare digits.
    /// Widens the column, then converts existing rows. Down reverses both steps.
    /// </summary>
    public partial class MobileE164Format : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Mobile",
                table: "Employees",
                type: "nchar(13)",
                fixedLength: true,
                maxLength: 13,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nchar(10)",
                oldFixedLength: true,
                oldMaxLength: 10);

            // Existing rows hold 10 digits such as 9171234567; prefix them with the country code.
            migrationBuilder.Sql(
                "UPDATE [Employees] SET [Mobile] = N'+63' + RTRIM([Mobile]) WHERE LEFT([Mobile], 1) <> N'+';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Strip the +63 prefix so values fit back into 10 characters.
            migrationBuilder.Sql(
                "UPDATE [Employees] SET [Mobile] = SUBSTRING([Mobile], 4, 10) WHERE LEFT([Mobile], 3) = N'+63';");

            migrationBuilder.AlterColumn<string>(
                name: "Mobile",
                table: "Employees",
                type: "nchar(10)",
                fixedLength: true,
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nchar(13)",
                oldFixedLength: true,
                oldMaxLength: 13);
        }
    }
}
