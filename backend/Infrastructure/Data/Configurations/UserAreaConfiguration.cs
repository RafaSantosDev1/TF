using Backend.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Infrastructure.Data.Configurations;

public class UserAreaConfiguration : IEntityTypeConfiguration<UserArea>
{
    public void Configure(EntityTypeBuilder<UserArea> builder)
    {
        builder.HasKey(ua => new { ua.UserId, ua.Area });

        builder.Property(ua => ua.Area)
            .HasConversion<string>()
            .IsRequired();

        builder.HasOne(ua => ua.User)
            .WithMany(u => u.UserAreas)
            .HasForeignKey(ua => ua.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}