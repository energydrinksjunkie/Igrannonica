using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.Dataset
{
    public partial class imeFajla : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Datasets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Datasets");
        }
    }
}
